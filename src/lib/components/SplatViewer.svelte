<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";

  // Component props
  export let splatURL: string;

  let container: HTMLDivElement;

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

  onMount(() => {
    // 確保只在客戶端執行
    if (!browser) return;

    let renderer: THREE.WebGLRenderer;

    // 動態導入避免 SSR 問題
    (async () => {
      try {
        const { SplatMesh, SparkRenderer, dyno } = await import(
          "@sparkjsdev/spark"
        );

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
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

        // 創建 Splat Mesh
        const splatMesh = new SplatMesh({ url: splatURL });
        splatMesh.quaternion.set(1, 0, 0, 0);

        // 為 Unroll 特效設置縮放
        splatMesh.scale.set(1.5, 1.5, 1.5);

        scene.add(splatMesh);

        // 動畫時間變數
        const animateT = dyno.dynoFloat(0);
        let baseTime = 0;

        // 設置 Unroll 特效
        setupUnrollEffect(splatMesh, animateT, dyno);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.minDistance = 0.3;
        controls.maxDistance = 20;
        controls.update();

        function animate(time: number) {
          // 更新動畫時間
          baseTime += 1 / 60;
          animateT.value = baseTime;

          // 更新 Splat 渲染
          splatMesh.updateVersion();

          controls.update();
          renderer.render(scene, camera);
        }

        renderer.setAnimationLoop(animate);
      } catch (error) {
        console.error("Failed to initialize SplatViewer:", error);
      }
    })();

    // 返回清理函數
    return () => {
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
    };
  });
</script>

<!-- 綁定 container -->
<div bind:this={container}></div>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>
