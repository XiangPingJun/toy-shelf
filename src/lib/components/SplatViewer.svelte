<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";
  import { Spinner } from "$lib/components/ui/spinner/index.js";

  // Component props
  let { splatFile, cameraState } = $props();

  let container: HTMLDivElement;
  let renderer: THREE.WebGLRenderer;
  let controls: OrbitControls | null = $state(null);
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera | null = $state(null);
  let currentSplatMesh: any = null;
  let animateT: any = null;
  let dyno: any = null;
  let isInitialized = false;
  let baseTime = 0;
  let saveInterval: number | null = null;
  let lastCameraState: any = null;

  // 設置 Unroll 特效
  function setupUnrollEffect(splatMesh: any, animateT: any, dyno: any) {
    splatMesh.objectModifier = dyno.dynoBlock(
      { gsplat: dyno.Gsplat },
      { gsplat: dyno.Gsplat },
      ({ gsplat }: any) => {
        const d = new dyno.Dyno({
          inTypes: { gsplat: dyno.Gsplat, t: "float" },
          outTypes: { gsplat: dyno.Gsplat },
          // GLSL 工具
          globals: () => [
            dyno.unindent(`
              // 2D 旋轉矩陣
              mat2 rot(float a) {
                float s=sin(a),c=cos(a);
                return mat2(c,-s,s,c);
              }
            `),
          ],
          // Unroll 特效著色器邏輯
          statements: ({ inputs, outputs }: any) =>
            dyno.unindentLines(`
            ${outputs.gsplat} = ${inputs.gsplat};
            float t = ${inputs.t};
            vec3 scales = ${inputs.gsplat}.scales;
            vec3 localPos = ${inputs.gsplat}.center;
            
            // Unroll 特效：旋轉螺旋與垂直揭示
            localPos.xz *= rot((localPos.y*50.-20.)*exp(-t));
            ${outputs.gsplat}.center = localPos * (1.-exp(-t)*2.);
            ${outputs.gsplat}.scales = mix(vec3(0.002),scales,smoothstep(.3,.7,t+localPos.y-2.));
            ${outputs.gsplat}.rgba = ${inputs.gsplat}.rgba*step(0.,t*.5+localPos.y-.5);
          `),
        });

        gsplat = d.apply({
          gsplat,
          t: animateT,
        }).gsplat;

        return { gsplat };
      },
    );

    // 應用著色器修改到 splat mesh
    splatMesh.updateGenerator();
  }

  // 檢查相機狀態是否有變化
  function hasCameraStateChanged() {
    if (!camera || !controls) return false;

    const currentState = {
      position: {
        x: Math.round(camera.position.x * 1000) / 1000, // 精確到小數點後3位
        y: Math.round(camera.position.y * 1000) / 1000,
        z: Math.round(camera.position.z * 1000) / 1000,
      },
      target: {
        x: Math.round(controls.target.x * 1000) / 1000,
        y: Math.round(controls.target.y * 1000) / 1000,
        z: Math.round(controls.target.z * 1000) / 1000,
      },
    };

    if (!lastCameraState) {
      lastCameraState = currentState;
      return true;
    }

    const hasChanged =
      currentState.position.x !== lastCameraState.position.x ||
      currentState.position.y !== lastCameraState.position.y ||
      currentState.position.z !== lastCameraState.position.z ||
      currentState.target.x !== lastCameraState.target.x ||
      currentState.target.y !== lastCameraState.target.y ||
      currentState.target.z !== lastCameraState.target.z;

    if (hasChanged) {
      lastCameraState = currentState;
    }

    return hasChanged;
  }

  // 保存相機和控制器位置到 KV（只在有變化時）
  async function saveCameraState() {
    if (!camera || !controls || !browser) return;

    // 檢查是否有變化
    if (!hasCameraStateChanged()) {
      return;
    }

    try {
      const cameraStateToSave = {
        position: {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z,
        },
        target: {
          x: controls.target.x,
          y: controls.target.y,
          z: controls.target.z,
        },
      };

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
    } catch (error) {
      console.error("Failed to save camera state:", error);
    }
  }

  // 從 KV 載入相機狀態
  $effect(() => {
    if (!camera || !controls || !browser) return;
    camera.position.set(
      cameraState.position.x,
      cameraState.position.y,
      cameraState.position.z,
    );
    controls.target.set(
      cameraState.target.x,
      cameraState.target.y,
      cameraState.target.z,
    );
    controls.update();
    lastCameraState = {
      position: {
        x: Math.round(cameraState.position.x * 1000) / 1000,
        y: Math.round(cameraState.position.y * 1000) / 1000,
        z: Math.round(cameraState.position.z * 1000) / 1000,
      },
      target: {
        x: Math.round(cameraState.target.x * 1000) / 1000,
        y: Math.round(cameraState.target.y * 1000) / 1000,
        z: Math.round(cameraState.target.z * 1000) / 1000,
      },
    };
  });

  // 創建新的 Splat Mesh
  async function createSplatMesh() {
    if (!dyno) return null;

    const { SplatMesh, SplatFileType } = await import("@sparkjsdev/spark");

    const splatMesh = new SplatMesh({
      fileBytes: splatFile,
      fileType: SplatFileType.SPZ, // 使用 SPZ 格式
    });
    splatMesh.quaternion.set(1, 0, 0, 0);
    splatMesh.scale.set(1.5, 1.5, 1.5);

    animateT = dyno.dynoFloat(0);
    baseTime = 0;
    // 設置 Unroll 特效
    setupUnrollEffect(splatMesh, animateT, dyno);

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

    dyno = dynoImport;

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

    // 初始化動畫時間變數
    animateT = dyno.dynoFloat(0);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.minDistance = 0.3;
    controls.maxDistance = 20;
    controls.update();

    function animate() {
      baseTime += 1 / 30;
      animateT.value = baseTime;

      currentSplatMesh?.updateVersion();

      controls.update();
      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);
    isInitialized = true;

    // 初始化第一個 mesh
    await updateMesh();

    // 設置定時器檢查相機狀態變化（每500ms檢查一次）
    saveInterval = setInterval(saveCameraState, 500);
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
