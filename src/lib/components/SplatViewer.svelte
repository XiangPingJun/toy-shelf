<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";

  // Component props
  export let splatURL: string;

  let container: HTMLDivElement;

  onMount(() => {
    // 確保只在客戶端執行
    if (!browser) return;

    let renderer: THREE.WebGLRenderer;

    // 動態導入避免 SSR 問題
    (async () => {
      try {
        const { SplatMesh, SparkRenderer } = await import("@sparkjsdev/spark");

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          50,
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
        if (container) {
          container.appendChild(renderer.domElement);
        }

        const frame = new THREE.Group();
        frame.quaternion.set(1, 0, 0, 0);

        const butterfly = new SplatMesh({ url: splatURL });
        frame.add(butterfly);
        scene.add(frame);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.minDistance = 0.3;
        controls.maxDistance = 20;
        controls.update();

        function animate(time: number) {
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
