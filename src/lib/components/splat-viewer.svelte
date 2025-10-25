<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";
  import {
    activePage,
    splatPov,
    autoRotate,
    resources,
  } from "$lib/stores/store";

  let container: HTMLDivElement;
  let renderer: THREE.WebGLRenderer;
  let controls = $state() as OrbitControls;
  let scene: THREE.Scene;
  let camera = $state() as THREE.PerspectiveCamera;
  let currentSplatMesh: any = null;
  let isInitialized = false;
  let baseTime = 0;
  let saveInterval: ReturnType<typeof setInterval>;
  let position: THREE.Vector3 | undefined = $state();
  let target: THREE.Vector3 | undefined = $state();
  let lastSavedPov: string | undefined;

  $effect(() => {
    const p = JSON.parse($splatPov || "{}");
    position = new THREE.Vector3(p[0], p[1], p[2]);
    target = new THREE.Vector3(p[3], p[4], p[5]);
  });

  $effect(() => {
    if (controls) {
      controls.autoRotate = $autoRotate;
    }
  });

  // 保存相機和控制器位置到 KV（只在有變化時）
  async function saveCameraState() {
    if ($autoRotate) {
      return;
    }

    const povToSave = JSON.stringify([
      ...camera.position.toArray().map((v) => parseFloat(v.toFixed(4))),
      ...controls.target.toArray().map((v) => parseFloat(v.toFixed(4))),
    ]);

    if (lastSavedPov !== povToSave) {
      lastSavedPov = povToSave;
      await fetch("/api/kv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "splat-camera-state",
          value: povToSave,
        }),
      });
      console.info(povToSave);
    }
  }

  // 創建新的 Splat Mesh
  async function createSplatMesh() {
    const { SplatMesh, SplatFileType } = await import("@sparkjsdev/spark");

    const splatMesh = new SplatMesh({
      url: $resources[$activePage.url],
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
    currentSplatMesh = newMesh;
    scene.add(currentSplatMesh);
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

    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0), 0);
    const spark = new SparkRenderer({ renderer });
    spark.preBlurAmount = 0;
    spark.blurAmount = 0;

    // 將 renderer.domElement 附加到 container
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.minDistance = 0.3;
    controls.maxDistance = 20;
    controls.update();
    controls.autoRotateSpeed = 0.15;

    function animate() {
      currentSplatMesh?.updateVersion();
      renderer.render(scene, camera);
      if (position) {
        if (camera.position.distanceTo(position) < 0.01) {
          position = undefined;
        } else {
          camera.position.lerp(position, 0.075);
        }
      }

      if (target) {
        if (controls.target.distanceTo(target) < 0.01) {
          target = undefined;
        } else {
          controls.target.lerp(target, 0.075);
        }
      }
      controls?.update();
    }

    renderer?.setAnimationLoop(animate);
    isInitialized = true;

    await updateMesh();

    controls.addEventListener("end", () => {
      if (controls) {
        $autoRotate = false;
        position = undefined;
        target = undefined;
      }
    });

    saveInterval = setInterval(saveCameraState, 1000);
  });

  onDestroy(() => {
    clearInterval(saveInterval);

    renderer?.setAnimationLoop(null);
    if (
      container &&
      renderer.domElement &&
      container.contains(renderer.domElement)
    ) {
      container.removeChild(renderer.domElement);
    }
    renderer?.dispose();
    controls?.dispose();
  });
</script>

<!-- 綁定 container -->
<div
  class="w-100vw h-100dvh fixed z--1 cursor-grab"
  bind:this={container}
></div>
