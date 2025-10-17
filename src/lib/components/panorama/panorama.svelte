<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";

  // Props
  interface Props {
    src: string;
    pov?: any;
    mode?: "panorama" | "littlePlanet";
    blur?: boolean;
    dev?: boolean;
  }

  let {
    src,
    pov,
    mode = "littlePlanet",
    blur = false,
    dev = true,
  }: Props = $props();

  // State
  let canvasElement: HTMLCanvasElement;
  let loaded = $state(false);
  let zoom = $state(0);
  let width = $state(800);
  let height = $state(600);

  // THREE.js objects
  let scene: THREE.Scene;
  let renderer: THREE.WebGLRenderer;
  let camera: THREE.PerspectiveCamera;
  let controls: OrbitControls;
  let environmentSphere: THREE.Mesh;
  let animationId: number;

  const clock = new THREE.Clock();
  const animationSpeed = 0.15;

  const views = {
    panorama: {
      distance: 1,
      phi: Math.PI / 2,
      theta: 0,
      zoom: 1,
    },
    littlePlanet: {
      distance: 800,
      phi: Math.PI / 6,
      theta: 0,
      zoom: 1,
    },
  };

  // Reactive effects
  $effect(() => {
    if (src && canvasElement) {
      loadPanorama();
    }
  });

  $effect(() => {
    if (pov && controls && loaded) {
      // Apply POV if provided
      try {
        if (pov.target) {
          controls.target.fromArray(pov.target);
        }
        if (pov.position) {
          camera.position.fromArray(pov.position);
        }
        controls.update();
      } catch (e) {
        console.warn("Failed to apply POV:", e);
      }
    }
  });

  $effect(() => {
    if (mode && controls && loaded) {
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

    controls = new OrbitControls(camera, canvasElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.5;
    controls.maxDistance = 2000;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 1.0;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;

    startAnimation();
  }

  function setView({
    distance,
    phi,
    theta,
    zoom: zoomLevel,
  }: typeof views.panorama) {
    if (!controls || !camera) return;

    // Set camera position using spherical coordinates
    const spherical = new THREE.Spherical(distance, phi, theta);
    camera.position.setFromSpherical(spherical);

    // Set target to center
    controls.target.set(0, 0, 0);

    // Update camera zoom
    camera.zoom = zoomLevel;
    camera.updateProjectionMatrix();

    // Enable/disable controls based on mode
    controls.enabled = true;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.enablePan = false;

    // Update controls
    controls.update();

    zoom = zoomLevel;
  }

  function onWheel(event: WheelEvent) {
    if (!controls || !dev) return;

    event.preventDefault();
    zoom += event.deltaY * -0.0002;
    camera.zoom = Math.max(0.1, Math.min(2, zoom));
    camera.updateProjectionMatrix();
  }

  function startAnimation() {
    function onFrameRequest() {
      if (!controls || !renderer || !scene || !camera) return;

      controls.update();
      renderer.render(scene, camera);

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

  function handleResize() {
    if (!controls || !camera || !renderer) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    controls.update();
  }

  // Export methods for external control
  export function setViewMode(newMode: "panorama" | "littlePlanet") {
    mode = newMode;
  }

  export function getCameraState() {
    if (!controls || !camera) return null;
    return {
      position: camera.position.toArray(),
      target: controls.target.toArray(),
      zoom: camera.zoom,
    };
  }

  export function setCameraState(state: any) {
    if (controls && camera && loaded && state) {
      if (state.position) {
        camera.position.fromArray(state.position);
      }
      if (state.target) {
        controls.target.fromArray(state.target);
      }
      if (state.zoom) {
        camera.zoom = state.zoom;
        camera.updateProjectionMatrix();
      }
      controls.update();
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

    if (controls) {
      controls.dispose();
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

  {#if dev && loaded}
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
    z-index: 1;
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
