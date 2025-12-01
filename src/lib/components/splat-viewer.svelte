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
  let camera = $state() as THREE.PerspectiveCamera;
  let viewer: any = null;
  let isInitialized = false;
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

  // 載入場景
  async function loadScene() {
    if (!viewer || !isInitialized) return;

    try {
      const url = $resources[$activePage.url];
      if (!url) {
        console.error("No URL found for splat scene");
        return;
      }

      const isSPZ = url.toLowerCase().endsWith(".spz");

      if (isSPZ) {
        // SPZ files are gzipped PLY files, need to decompress first
        const { gunzipSync } = await import("fflate");

        // Fetch the .spz file
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();

        // Decompress the gzipped PLY data
        const decompressed = gunzipSync(new Uint8Array(buffer));

        // Create a blob URL for the decompressed PLY data
        const blob = new Blob([decompressed], {
          type: "application/octet-stream",
        });
        const plyUrl = URL.createObjectURL(blob);

        // Load the decompressed PLY data
        await viewer.addSplatScene(plyUrl, {
          position: [0, 0, 0],
          rotation: [0, 0, 0, 1],
          scale: [1.5, 1.5, 1.5],
          splatAlphaRemovalThreshold: 5,
        });

        // Clean up the blob URL after loading
        URL.revokeObjectURL(plyUrl);
      } else {
        // Direct loading for PLY, SPLAT, KSPLAT files
        await viewer.addSplatScene(url, {
          position: [0, 0, 0],
          rotation: [0, 0, 0, 1],
          scale: [1.5, 1.5, 1.5],
          splatAlphaRemovalThreshold: 5,
        });
      }
    } catch (error) {
      console.error("Failed to load splat scene:", error);
    }
  }

  onMount(async () => {
    // 確保只在客戶端執行
    if (!browser) return;

    const GaussianSplats3D = await import("@mkkellogg/gaussian-splats-3d");

    // 初始化 Three.js renderer 和 camera
    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(-1, -4, 6);
    camera.up.set(0, -1, -0.6).normalize();
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0), 0);

    // 將 renderer.domElement 附加到 container
    container.appendChild(renderer.domElement);

    // 初始化 OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.minDistance = 0.3;
    controls.maxDistance = 20;
    controls.autoRotateSpeed = 0.15;
    controls.update();

    // 初始化 GaussianSplats3D Viewer
    viewer = new GaussianSplats3D.Viewer({
      selfDrivenMode: false,
      renderer: renderer,
      camera: camera,
      useBuiltInControls: false,
      gpuAcceleratedSort: true,
      enableSIMDInSort: true,
      sharedMemoryForWorkers: true,
      integerBasedSort: true,
      halfPrecisionCovariancesOnGPU: true,
      renderMode: GaussianSplats3D.RenderMode.Always,
      sceneRevealMode: GaussianSplats3D.SceneRevealMode.Instant,
    });

    // 動畫循環
    function animate() {
      // 相機位置平滑過渡
      if (position) {
        if (camera.position.distanceTo(position) < 0.01) {
          position = undefined;
        } else {
          camera.position.lerp(position, 0.075);
        }
      }

      // 相機目標平滑過渡
      if (target) {
        if (controls.target.distanceTo(target) < 0.01) {
          target = undefined;
        } else {
          controls.target.lerp(target, 0.075);
        }
      }

      controls?.update();
      viewer?.update();
      viewer?.render();
    }

    renderer?.setAnimationLoop(animate);
    isInitialized = true;

    // 載入場景
    await loadScene();

    // 當用戶手動控制時，停止自動旋轉和過渡
    controls.addEventListener("end", () => {
      if (controls) {
        $autoRotate = false;
        position = undefined;
        target = undefined;
      }
    });

    // 定期保存相機狀態
    saveInterval = setInterval(saveCameraState, 1000);

    // 處理窗口大小變化
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // 清理窗口事件監聽器
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  onDestroy(() => {
    clearInterval(saveInterval);

    renderer?.setAnimationLoop(null);
    viewer?.dispose();

    if (
      container &&
      renderer?.domElement &&
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
