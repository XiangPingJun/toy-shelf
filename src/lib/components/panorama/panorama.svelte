<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import * as THREE from "three";
  import CameraControls from "camera-controls";

  let {
    panTexture,
    pov,
    mode = "panorama",
  }: {
    panTexture: any;
    pov: any;
    mode?: "panorama" | "littlePlanet";
  } = $props();

  // State
  let canvasElement: HTMLCanvasElement;
  let zoom = 0;
  let width = $state(800);
  let height = $state(600);
  let loaded = $state(false);

  // THREE.js objects
  let scene: THREE.Scene;
  let renderer: THREE.WebGLRenderer;
  let camera: THREE.PerspectiveCamera;
  let cameraControls: CameraControls;
  let environmentSphere: THREE.Mesh;
  let animationId: number;
  let autoRotate = true;

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

  $effect(() => {
    if (pov && cameraControls) {
      cameraControls.fromJSON(pov, true);
      autoRotate = false;
    }
  });

  $effect(() => {
    if (mode && cameraControls) {
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

    startAnimation();
  }

  function setView({
    distanceFromCenter,
    horizontalAngle,
    verticalAngle,
    zoomFactor,
  }: typeof views.panorama) {
    if (!cameraControls) return;
    cameraControls.setPosition(0, 0, distanceFromCenter, true);
    cameraControls.rotateTo(rad(horizontalAngle), rad(verticalAngle), true);
    zoom = zoomFactor;
    cameraControls.zoomTo(zoom, true);
  }

  $effect(() => {
    if (mode) {
      zoom = views[mode].zoomFactor;
    }
  });

  function onWheel(event: WheelEvent) {
    if (!cameraControls) return;

    autoRotate = false;
    event.preventDefault();
    zoom += event.deltaY * -0.0002;
    cameraControls.zoomTo(zoom);
  }

  function startAnimation() {
    function onFrameRequest() {
      if (!cameraControls || !renderer || !scene || !camera) return;

      const delta = clock.getDelta();
      const cameraChanged = cameraControls.update(delta * animationSpeed);

      if (autoRotate) {
        cameraControls.azimuthAngle += 0.5 * delta * THREE.MathUtils.DEG2RAD;
      }

      if (cameraChanged) {
        renderer.render(scene, camera);
      }

      animationId = requestAnimationFrame(onFrameRequest);
    }

    onFrameRequest();
  }

  async function createEnvironmentSphere() {
    try {
      panTexture.mapping = THREE.EquirectangularReflectionMapping;
      panTexture.colorSpace = THREE.SRGBColorSpace;
      panTexture.wrapS = THREE.RepeatWrapping;
      panTexture.repeat.x = -1;

      environmentSphere = new THREE.Mesh(
        new THREE.SphereGeometry(500, 100, 50),
        new THREE.MeshBasicMaterial({
          map: panTexture,
          side: THREE.BackSide,
        }),
      );
    } catch (error) {
      console.error("Failed to load panorama texture:", error);
      throw error;
    }
  }

  async function loadPanorama() {
    if (!canvasElement) return;

    try {
      await createEnvironmentSphere();
      createScene();
      setView(views[mode]);
      handleResize();
      // 延遲一小段時間再設為loaded，確保渲染已開始
      setTimeout(() => {
        loaded = true;
      }, 100);
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

  let lastSavedPov: string | undefined;

  async function saveCameraState() {
    if (autoRotate) {
      return;
    }

    const povToSave = cameraControls.toJSON();

    if (lastSavedPov !== povToSave) {
      lastSavedPov = povToSave;
      await fetch("/api/kv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "pan-camera-state",
          value: povToSave,
        }),
      });
      console.log(JSON.stringify(povToSave));
    }
  }

  let saveInterval: number | undefined;

  onMount(() => {
    // Set initial dimensions on client side
    if (typeof window !== "undefined") {
      width = window.innerWidth;
      height = window.innerHeight;
    }

    loadPanorama();

    saveInterval = setInterval(saveCameraState, 1000);
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

    clearInterval(saveInterval);
  });
</script>

<div
  class="panorama-container w-100vw h-100dvh fixed z--1 cursor-grab"
  class:loaded
>
  <canvas
    bind:this={canvasElement}
    {width}
    {height}
    onwheel={onWheel}
    onmousedown={() => (autoRotate = false)}
    ontouchstart={() => (autoRotate = false)}
    class="panorama-canvas w-full h-full"
  ></canvas>
</div>

<style>
  .panorama-container {
    opacity: 0;
    transition: opacity 0.5s ease-out;
  }

  .panorama-container.loaded {
    opacity: 1;
  }
</style>
