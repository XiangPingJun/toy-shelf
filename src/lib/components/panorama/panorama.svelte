<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import * as THREE from "three";
  import CameraControls from "camera-controls";

  // Props
  interface Props {
    src: string;
    pov?: any;
    mode?: "panorama" | "littlePlanet";
    blur?: boolean;
  }

  let { src, pov, mode = "littlePlanet", blur = false }: Props = $props();

  // State
  let canvasElement: HTMLCanvasElement;
  let loaded = $state(false);
  let zoom = 0;
  let width = $state(800);
  let height = $state(600);

  // THREE.js objects
  let scene: THREE.Scene;
  let renderer: THREE.WebGLRenderer;
  let camera: THREE.PerspectiveCamera;
  let cameraControls: CameraControls;
  let environmentSphere: THREE.Mesh;
  let animationId: number;

  const clock = new THREE.Clock();
  const animationSpeed = 0.15;

  const views = {
    panorama: {
      distanceFromCenter: 0.01,
      horizontalAngle: 70,
      verticalAngle: 100,
      zoomFactor: 1,
    },
    littlePlanet: {
      distanceFromCenter: -500,
      horizontalAngle: 200,
      verticalAngle: 0,
      zoomFactor: 0.15,
    },
  };

  // Reactive effects
  $effect(() => {
    if (src && canvasElement) {
      loadPanorama();
    }
  });

  $effect(() => {
    if (pov && cameraControls && loaded) {
      // Apply POV if provided
      try {
        cameraControls.fromJSON(pov, true);
      } catch (e) {
        console.warn("Failed to apply POV:", e);
      }
    }
  });

  $effect(() => {
    if (mode && cameraControls && loaded) {
      setView(views[mode]);
    }
  });

  function createScene() {
    scene = new THREE.Scene();
    scene.add(environmentSphere);

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvasElement,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(
      typeof window !== "undefined" ? window.devicePixelRatio : 1,
    );
    renderer.setSize(width, height);

    camera = new THREE.PerspectiveCamera(45, width / height, 0.2, 2000);

    CameraControls.install({ THREE });
    cameraControls = new CameraControls(camera, canvasElement);
    cameraControls.smoothTime = 0.04;
    cameraControls.restThreshold = 1;
    cameraControls.addEventListener("rest", () => {
      cameraControls.enabled = true;
    });

    startAnimation();
  }

  function setView({
    distanceFromCenter,
    horizontalAngle,
    verticalAngle,
    zoomFactor,
  }: typeof views.panorama) {
    if (!cameraControls) return;

    cameraControls.enabled = false;
    cameraControls.setPosition(0, 0, distanceFromCenter, true);
    cameraControls.rotateTo(rad(horizontalAngle), rad(verticalAngle), true);
    zoom = zoomFactor;
    cameraControls.zoomTo(zoom, true);
  }

  function onWheel(event: WheelEvent) {
    if (!cameraControls) return;

    event.preventDefault();
    console.log(zoom);
    zoom += event.deltaY * -0.0002;
    cameraControls.zoomTo(zoom);
  }

  function startAnimation() {
    function onFrameRequest() {
      if (!cameraControls || !renderer || !scene || !camera) return;

      const delta = clock.getDelta();
      const cameraChanged = cameraControls.update(delta * animationSpeed);

      if (cameraChanged) {
        renderer.render(scene, camera);
      }

      animationId = requestAnimationFrame(onFrameRequest);
    }

    onFrameRequest();
  }

  async function createEnvironmentSphere(imageUrl: string) {
    try {
      const environmentMap = await new THREE.TextureLoader().loadAsync(
        imageUrl,
      );

      environmentMap.mapping = THREE.EquirectangularReflectionMapping;
      environmentMap.colorSpace = THREE.SRGBColorSpace;
      environmentMap.wrapS = THREE.RepeatWrapping;
      environmentMap.repeat.x = -1;

      environmentSphere = new THREE.Mesh(
        new THREE.SphereGeometry(500, 100, 50),
        new THREE.MeshBasicMaterial({
          map: environmentMap,
          side: THREE.BackSide,
        }),
      );
    } catch (error) {
      console.error("Failed to load panorama texture:", error);
      throw error;
    }
  }

  async function loadPanorama() {
    if (!src || !canvasElement) return;

    try {
      loaded = false;
      await createEnvironmentSphere(src);
      createScene();
      loaded = true;
      setView(views[mode]);
      handleResize();
    } catch (error) {
      console.error("Failed to load panorama:", error);
    }
  }

  function rad(deg: number) {
    return THREE.MathUtils.degToRad(deg);
  }

  function handleResize() {
    if (!cameraControls || !camera || !renderer) return;

    cameraControls.saveState();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    cameraControls.reset(false);
    renderer.setSize(width, height);
  }

  // Export methods for external control
  export function setViewMode(newMode: "panorama" | "littlePlanet") {
    mode = newMode;
  }

  export function getCameraState() {
    return cameraControls?.toJSON();
  }

  export function setCameraState(state: any) {
    if (cameraControls && loaded) {
      cameraControls.fromJSON(state, true);
    }
  }

  onMount(() => {
    // Set initial dimensions on client side
    if (typeof window !== "undefined") {
      width = window.innerWidth;
      height = window.innerHeight;
    }

    // Force full screen dimensions and handle window resize
    function onWindowResize() {
      if (typeof window !== "undefined") {
        width = window.innerWidth;
        height = window.innerHeight;
        handleResize();
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", onWindowResize);

      return () => {
        window.removeEventListener("resize", onWindowResize);
      };
    }
  });

  onDestroy(() => {
    // Cleanup
    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    if (renderer) {
      renderer.dispose();
    }

    if (cameraControls) {
      cameraControls.dispose();
    }

    // Dispose geometries and materials
    if (environmentSphere) {
      environmentSphere.geometry.dispose();
      if (environmentSphere.material instanceof THREE.Material) {
        environmentSphere.material.dispose();
      }
    }
  });
</script>

<div class="panorama-container">
  <canvas
    bind:this={canvasElement}
    {width}
    {height}
    onwheel={onWheel}
    class="panorama-canvas"
    class:loaded
    class:blur
    style:pointer-events="auto"
  ></canvas>

  {#if loaded}
    <button class="control-btn left" onclick={() => setViewMode("panorama")}>
      Panorama
    </button>
    <button
      class="control-btn right"
      onclick={() => setViewMode("littlePlanet")}
    >
      Little Planet
    </button>
  {/if}

  {#if !loaded}
    <div class="loading">Loading panorama...</div>
  {/if}
</div>

<style>
  .panorama-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }

  .panorama-canvas {
    display: block;
    width: 100%;
    height: 100%;
    touch-action: none;
    opacity: 0;
    transition:
      opacity 1s ease-out,
      filter 0.5s ease-out;
  }

  .panorama-canvas.loaded {
    opacity: 1;
  }

  .panorama-canvas.blur {
    filter: blur(0.5rem);
  }

  .control-btn {
    position: fixed;
    top: 20px;
    z-index: 99999;
    pointer-events: all;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-family: inherit;
  }

  .control-btn.left {
    left: 20px;
  }

  .control-btn.right {
    right: 20px;
  }

  .control-btn:hover {
    background: rgba(0, 0, 0, 0.9);
  }

  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    background: rgba(0, 0, 0, 0.7);
    padding: 20px;
    border-radius: 8px;
    font-family: inherit;
  }
</style>
