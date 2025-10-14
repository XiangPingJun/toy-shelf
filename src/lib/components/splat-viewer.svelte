<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";

  // Component props
  let { splatFile, pov } = $props();

  let container: HTMLDivElement;
  let renderer: THREE.WebGLRenderer;
  let controls: OrbitControls | undefined = $state();
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera | undefined = $state();
  let currentSplatMesh: any = null;
  let isInitialized = false;
  let baseTime = 0;
  let saveInterval: number | null = null;
  let camPos: THREE.Vector3 | null = $state(null);
  let ctrlTgt: THREE.Vector3 | null = $state(null);
  let lastSavedCameraState: string | undefined;

  $effect(() => {
    camPos = new THREE.Vector3(...pov.camPos);
    ctrlTgt = new THREE.Vector3(...pov.ctrlTgt);
  });

  // 保存相機和控制器位置到 KV（只在有變化時）
  async function saveCameraState() {
    if (!camera || !controls || !browser || controls.autoRotate) {
      return;
    }

    const cameraStateToSave = {
      camPos: camera.position.toArray().map((v) => parseFloat(v.toFixed(6))),
      ctrlTgt: controls.target.toArray().map((v) => parseFloat(v.toFixed(6))),
    };

    if (lastSavedCameraState !== JSON.stringify(cameraStateToSave)) {
      lastSavedCameraState = JSON.stringify(cameraStateToSave);
      await fetch("/api/kv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "splat-camera-state",
          value: cameraStateToSave,
        }),
      });
      console.log(JSON.stringify(cameraStateToSave));
    }
  }

  // 創建新的 Splat Mesh
  async function createSplatMesh() {
    const { SplatMesh, SplatFileType } = await import("@sparkjsdev/spark");

    const splatMesh = new SplatMesh({
      fileBytes: splatFile,
      fileType: SplatFileType.SPZ, // 使用 SPZ 格式
    });
    splatMesh.quaternion.set(1, 0, 0, 0);
    splatMesh.scale.set(1.5, 1.5, 1.5);

    baseTime = 0;

    return splatMesh;
  }

  // 更新 mesh
  async function updateMesh() {
    if (!scene || !isInitialized) return;

    // 移除舊的 mesh
    if (currentSplatMesh) {
      scene.remove(currentSplatMesh);
      currentSplatMesh = null;
    }

    // 創建新的 mesh
    const newMesh = await createSplatMesh();
    if (newMesh) {
      currentSplatMesh = newMesh;
      scene.add(currentSplatMesh);
    }
  }

  onMount(async () => {
    // 確保只在客戶端執行
    if (!browser) return;

    const { SparkRenderer, dyno: dynoImport } = await import(
      "@sparkjsdev/spark"
    );

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    // 為 Unroll 特效設置初始相機位置
    camera.position.set(0, 2, 2.5);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0), 0);
    const spark = new SparkRenderer({ renderer });
    spark.preBlurAmount = 0;
    spark.blurAmount = 0;

    // 將 renderer.domElement 附加到 container
    if (container) {
      container.appendChild(renderer.domElement);
    }

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.minDistance = 0.3;
    controls.maxDistance = 20;
    controls.update();
    controls.autoRotateSpeed = 0.2;

    function animate() {
      currentSplatMesh?.updateVersion();
      if (camera) {
        renderer.render(scene, camera);
      }
      if (camera && camPos) {
        if (camera.position.distanceTo(camPos) < 0.01) {
          camPos = null;
        } else {
          camera.position.lerp(camPos, 0.1);
        }
      }
      if (controls && ctrlTgt) {
        if (controls.target.distanceTo(ctrlTgt) < 0.01) {
          ctrlTgt = null;
        } else {
          controls.target.lerp(ctrlTgt, 0.1);
        }
      }
      controls?.update();
    }

    renderer.setAnimationLoop(animate);
    isInitialized = true;

    await updateMesh();

    await new Promise((r) => setTimeout(r, 2000));
    controls.autoRotate = true;
    controls.addEventListener("end", () => {
      if (controls) {
        controls.autoRotate = false;
      }
    });

    saveInterval = setInterval(saveCameraState, 1000);
  });

  onDestroy(() => {
    if (saveInterval) {
      clearInterval(saveInterval);
      saveInterval = null;
    }

    if (renderer) {
      renderer.setAnimationLoop(null);
      if (
        container &&
        renderer.domElement &&
        container.contains(renderer.domElement)
      ) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    }

    if (controls) {
      controls.dispose();
    }
  });
</script>

<!-- 綁定 container -->
<div
  class="w-100vw h-100dvh fixed z--1 cursor-grab"
  bind:this={container}
></div>
