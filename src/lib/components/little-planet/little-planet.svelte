<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import Program from "./webgl-program.js";
  import { vs, fs } from "./shaders.js";

  // Props
  interface Props {
    src: string;
    width?: number;
    height?: number;
    mode?: "planet" | "pano";
    static?: boolean;
  }

  let {
    src,
    width = 512,
    height = 512,
    mode = "planet",
    static: isStatic = false,
  }: Props = $props();

  // Constants
  const RAD = Math.PI / 180;
  const QUAD = new Float32Array([1, -1, -1, -1, 1, 1, -1, 1]);
  const FOV_RANGE = [50, 120];
  const LAT_RANGE = [-90, 90];
  const DEFAULT_PANO_FOV = (FOV_RANGE[0] + FOV_RANGE[1]) / 2;
  const DEFAULT_PLANET_FOV = 240;
  const DBLCLICK = 300;
  const TRANSITION_DURATION = 2000;

  // State
  let canvasElement: HTMLCanvasElement;
  let gl: WebGL2RenderingContext;
  let program: any;
  let dirty = $state(false);
  let image: HTMLImageElement | null = $state(null);
  let camera = $state({ lat: 0, lon: 0, fov: DEFAULT_PANO_FOV });
  let currentMode = $state(mode);
  let pointers: PointerEvent[] = $state([]);
  let originalCamera: typeof camera | null = $state(null);
  let lastFirstDown = 0;
  let loading = $state(false);
  let error = $state(false);

  // Event dispatcher
  const dispatch = createEventDispatcher();

  // Reactive effects
  $effect(() => {
    if (src && canvasElement) {
      loadImage(src);
    }
  });

  $effect(() => {
    if (width && canvasElement) {
      canvasElement.width = width;
      syncSize();
    }
  });

  $effect(() => {
    if (height && canvasElement) {
      canvasElement.height = height;
      syncSize();
    }
  });

  $effect(() => {
    currentMode = mode;
    changed();
  });

  // Component methods
  async function loadImageFromSrc(src: string) {
    image = null;
    if (gl) {
      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    try {
      error = false;
      loading = true;

      image = await loadImageHelper(src);
      createTextures(image, gl);
      camera = { lat: 0, lon: 0, fov: DEFAULT_PANO_FOV };
      currentMode = mode;
      render();

      loading = false;
      dispatch("load");
    } catch (e) {
      error = true;
      dispatch("error", e);
    }
  }

  function onPointerDown(e: PointerEvent) {
    if (isStatic || !image) return;

    if (currentMode === "planet") {
      return transition("pano");
    }

    if (pointers.length === 0) {
      const last = lastFirstDown;
      const ts = performance.now();
      if (ts - last < DBLCLICK) {
        return transition("planet");
      } else {
        lastFirstDown = ts;
      }
    }

    pointers = [...pointers, e];
    if (pointers.length === 1) {
      originalCamera = { ...camera };
      canvasElement.setPointerCapture(e.pointerId);
    }
  }

  function onPointerUp(e: PointerEvent) {
    if (isStatic || !image) return;

    if (pointers.length === 1) {
      canvasElement.releasePointerCapture(e.pointerId);
    }
    pointers = pointers.filter((pointer) => pointer.pointerId !== e.pointerId);
  }

  function onPointerMove(e: PointerEvent) {
    if (isStatic || !image || !canvasElement) return;

    const anglePerPixel =
      camera.fov /
      Math.max(canvasElement.clientWidth, canvasElement.clientHeight);

    switch (pointers.length) {
      case 2: // zoom/fov
        const oldDist = pointerDistance(pointers[0], pointers[1]);
        pointers = pointers.map((p, i) =>
          p.pointerId === e.pointerId ? e : p,
        );
        const newDist = pointerDistance(pointers[0], pointers[1]);
        const diff = newDist - oldDist;
        updateCamera({ fov: camera.fov - diff * anglePerPixel });
        break;

      case 1: // pan
        if (!originalCamera) return;
        const dx = e.x - pointers[0].x;
        const dy = e.y - pointers[0].y;

        const dlon = dx * anglePerPixel;
        const dlat = dy * anglePerPixel;

        updateCamera({
          lon: originalCamera.lon - dlon,
          lat: originalCamera.lat + dlat,
        });
        break;
    }
  }

  function onWheel(e: WheelEvent) {
    if (currentMode === "planet" || isStatic || !image) return;
    e.preventDefault();
    const fovDelta = e.deltaY * 0.05;
    updateCamera({ fov: camera.fov + fovDelta });
  }

  function updateCamera(newCamera: Partial<typeof camera>) {
    camera = {
      ...camera,
      ...newCamera,
      fov: constrain(newCamera.fov ?? camera.fov, FOV_RANGE),
      lat: constrain(newCamera.lat ?? camera.lat, LAT_RANGE),
    };
    changed();
  }

  function transition(targetMode: "planet" | "pano") {
    isStatic = true;

    const startTime = performance.now();

    function step() {
      const time = performance.now();
      let phase = (time - startTime) / TRANSITION_DURATION;
      phase = Math.min(phase, 1);

      const uniforms = computeTransitionUniforms(
        targetMode === "planet" ? 1 - phase : phase,
        camera,
      );

      render(uniforms);

      if (phase < 1) {
        requestAnimationFrame(step);
      } else {
        currentMode = targetMode;
        isStatic = false;
        changed();
        dispatch("change", { mode: currentMode });
      }
    }

    requestAnimationFrame(step);
  }

  function changed() {
    if (!dirty && image) {
      dirty = true;
      requestAnimationFrame(() => render());
    }
    dispatch("change", { mode: currentMode, camera });
  }

  function syncSize() {
    if (!canvasElement || !program || !gl) return;

    const port = [canvasElement.width, canvasElement.height];
    gl.viewport(0, 0, ...port);
    program.uniform.port.set(port);

    if (image) render();
  }

  function render(forceUniforms: any = {}) {
    if (!gl || !program) return;

    let planet_pano_mix: number, rotation: [number, number];

    if (currentMode === "planet") {
      planet_pano_mix = 0;
      rotation = cameraToRotation(camera.lon, -90);
    } else {
      planet_pano_mix = 1;
      rotation = cameraToRotation(camera.lon, camera.lat);
    }

    const uniforms = {
      planet_pano_mix,
      rotation,
      pano_fov: camera.fov * RAD,
      planet_fov: DEFAULT_PLANET_FOV * RAD,
      ...forceUniforms,
    };

    for (const name in uniforms) {
      program.uniform[name].set(uniforms[name]);
    }

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    dirty = false;
  }

  // Mount and destroy
  onMount(() => {
    const context = createContext(canvasElement);
    gl = context.gl;
    program = context.program;

    if (!gl) {
      error = true;
      return;
    }

    syncSize();

    if (src) {
      loadImageFromSrc(src);
    }
  });

  // Export methods for external control
  export function setCamera(newCamera: Partial<typeof camera>) {
    updateCamera(newCamera);
  }

  export function setMode(newMode: "planet" | "pano") {
    currentMode = newMode;
    changed();
  }

  export function getPlanetSize() {
    return image ? 2 * image.naturalHeight : null;
  }

  // Helper functions
  function pointerDistance(p1: PointerEvent, p2: PointerEvent) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
  }

  function createTexture(src: HTMLCanvasElement, gl: WebGL2RenderingContext) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    return texture;
  }

  function createTextures(img: HTMLImageElement, gl: WebGL2RenderingContext) {
    const tmp = document.createElement("canvas");
    tmp.width = img.naturalWidth / 2;
    tmp.height = img.naturalHeight;
    const ctx = tmp.getContext("2d")!;

    ctx.drawImage(img, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    createTexture(tmp, gl);

    ctx.drawImage(img, -tmp.width, 0);
    gl.activeTexture(gl.TEXTURE1);
    createTexture(tmp, gl);
  }

  function loadImageHelper(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = src;
      image.onload = () => resolve(image);
      image.onerror = reject;
    });
  }

  function createContext(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true });
    let program: any = null;

    if (!gl) return { gl, program };

    program = new Program(gl, { vs, fs });
    program.use();

    Object.values(program.attribute).forEach((a: any) => a.enable());
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW);
    program.attribute.position.pointer(2, gl.FLOAT, false, 0, 0);

    program.uniform.texLeft.set(0);
    program.uniform.texRight.set(1);

    return { gl, program };
  }

  function computeTransitionUniforms(phase: number, panoCamera: typeof camera) {
    const descendStop = 0.9;
    const rotateStart = 0.6;

    const uniforms: any = {};

    if (phase < descendStop) {
      const frac = phase / descendStop;
      uniforms.planet_pano_mix = frac;
    } else {
      uniforms.planet_pano_mix = 1;
    }

    if (phase < rotateStart) {
      uniforms.rotation = cameraToRotation(panoCamera.lon, -90);
    } else {
      let frac = (phase - rotateStart) / (1 - rotateStart);
      frac = frac * frac;
      const lat = -90 + frac * (panoCamera.lat + 90);
      uniforms.rotation = cameraToRotation(panoCamera.lon, lat);
    }

    return uniforms;
  }

  function cameraToRotation(lon: number, lat: number): [number, number] {
    return [lon * RAD, (90 + lat) * RAD];
  }

  function constrain(value: number, limits: [number, number]) {
    return Math.min(Math.max(value, limits[0]), limits[1]);
  }
</script>

<div
  class="little-planet-container"
  style="display: inline-block; touch-action: none;"
>
  <canvas
    bind:this={canvasElement}
    {width}
    {height}
    onpointerdown={onPointerDown}
    onpointerup={onPointerUp}
    onpointermove={onPointerMove}
    onwheel={onWheel}
    style="display: block; width: 100%; height: 100%;"
  ></canvas>

  {#if loading}
    <div class="loading">Loading...</div>
  {/if}

  {#if error}
    <div class="error">WebGL 2 not supported 😢</div>
  {/if}
</div>

<style>
  .little-planet-container {
    position: relative;
  }

  .loading,
  .error {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px;
    border-radius: 4px;
  }
</style>
