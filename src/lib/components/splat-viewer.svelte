<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";

  // Component props
  let { splatFile, cameraStateTarget } = $props();

  let cameraState = $state({
    position: { x: 0, y: 0, z: 0 },
    target: { x: 0, y: 0, z: 0 },
  });
  let container: HTMLDivElement;
  let renderer: THREE.WebGLRenderer;
  let controls: OrbitControls | undefined = $state();
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera | undefined = $state();
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
              vec3 hash(vec3 p) {
                return fract(sin(p*123.456)*123.456);
              }

              mat2 rot(float a) {
                float s = sin(a), c = cos(a);
                return mat2(c, -s, s, c);
              }

              vec3 headMovement(vec3 pos, float t) {
                pos.xy *= rot(smoothstep(-1., -2., pos.y) * .2 * sin(t*2.));
                return pos;
              }

              vec3 breathAnimation(vec3 pos, float t) {
                float b = sin(t*1.5);
                pos.yz *= rot(smoothstep(-1., -3., pos.y) * .15 * -b);
                pos.z += .3;
                pos.y += 1.2;
                pos *= 1. + exp(-3. * length(pos)) * b;
                pos.z -= .3;
                pos.y -= 1.2;
                return pos;
              }

              vec4 fractal1(vec3 pos, float t, float intensity) {
                float m = 100.;
                vec3 p = pos * .1;
                p.y += .5;
                for (int i = 0; i < 8; i++) {
                  p = abs(p) / clamp(abs(p.x * p.y), 0.3, 3.) - 1.;
                  p.xy *= rot(radians(90.));
                  if (i > 1) m = min(m, length(p.xy) + step(.3, fract(p.z * .5 + t * .5 + float(i) * .2)));
                }
                m = step(m, 0.5) * 1.3 * intensity;
                return vec4(-pos.y * .3, 0.5, 0.7, .3) * intensity + m;
              }

              vec4 fractal2(vec3 center, vec3 scales, vec4 rgba, float t, float intensity) {
                vec3 pos = center;
                float splatSize = length(scales);
                float pattern = exp(-50. * splatSize);
                vec3 p = pos * .65;
                pos.y += 2.;
                float c = 0.;
                float l, l2 = length(p);
                float m = 100.;
                
                for (int i = 0; i < 10; i++) {
                  p.xyz = abs(p.xyz) / dot(p.xyz, p.xyz) - .8;
                  l = length(p.xyz);
                  c += exp(-1. * abs(l - l2) * (1. + sin(t * 1.5 + pos.y)));
                  l2 = length(p.xyz);
                  m = min(m, length(p.xyz));
                }
                
                c = smoothstep(0.3, 0.5, m + sin(t * 1.5 + pos.y * .5)) + c * .1;              
                return vec4(vec3(length(rgba.rgb)) * vec3(c, c*c, c*c*c) * intensity, 
                          rgba.a * exp(-20. * splatSize) * m * intensity);
              }

              vec4 sin3D(vec3 p, float t) {
                float m = exp(-2. * length(sin(p * 5. + t * 3.))) * 5.;
                return vec4(m) + .3;
              }

              vec4 disintegrate(vec3 pos, float t, float intensity) {
                vec3 p = pos + (hash(pos) * 2. - 1.) * intensity;
                float tt = smoothstep(-1., 0.5, -sin(t + -pos.y * .5));  
                p.xz *= rot(tt * 2. + p.y * 2. * tt);
                return vec4(mix(p, pos, tt), tt);
              }
              
              vec4 flare(vec3 pos, float t) {
                vec3 p = vec3(0., -1.5, 0.);
                float tt = smoothstep(-1., .5, sin(t + hash(pos).x));  
                tt = tt * tt;              
                p.x += sin(t * 2.) * tt;
                p.z += sin(t * 2.) * tt;
                p.y += sin(t) * tt;
                return vec4(mix(pos, p, tt), tt);
              }
            `),
          ],
          // Unroll 特效著色器邏輯
          statements: ({ inputs, outputs }: any) =>
            dyno.unindentLines(`
              ${outputs.gsplat} = ${inputs.gsplat};
            
              vec3 localPos = ${inputs.gsplat}.center;
              vec3 splatScales = ${inputs.gsplat}.scales;
              
              vec4 e = disintegrate(localPos, ${inputs.t}, ${inputs.intensity});
              ${outputs.gsplat}.center = e.xyz;
              ${outputs.gsplat}.scales = mix(vec3(.01, .01, .01), ${inputs.gsplat}.scales, e.w);
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

      cameraState = {
        position: {
          x: cameraStateTarget.position.x,
          y: cameraStateTarget.position.y,
          z: cameraStateTarget.position.z,
        },
        target: {
          x: cameraStateTarget.target.x,
          y: cameraStateTarget.target.y,
          z: cameraStateTarget.target.z,
        },
      };

      controls?.update();
      if (camera) {
        renderer.render(scene, camera);
      }
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
