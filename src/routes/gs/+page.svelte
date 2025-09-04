<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";
  import { SplatMesh } from "@sparkjsdev/spark";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";

  let container: HTMLDivElement;

  onMount(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0), 0);

    // 將 renderer.domElement 附加到 container
    if (container) {
      container.appendChild(renderer.domElement);
    }

    const splatURL = "/a.spz";
    const butterfly = new SplatMesh({ url: splatURL });
    scene.add(butterfly);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.minDistance = 0.3;
    controls.maxDistance = 20;
    controls.update();

    renderer.setAnimationLoop(function animate(time) {
      controls.update();
      renderer.render(scene, camera);
    });
  });
</script>

<!-- 綁定 container -->
<div bind:this={container}></div>
