<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";
  import { SplatMesh } from "@sparkjsdev/spark";

  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let butterfly: SplatMesh;

  onMount(() => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const splatURL = "/ggun.zip";
    butterfly = new SplatMesh({ url: splatURL });
    butterfly.quaternion.set(1, 0, 0, 0);
    butterfly.position.set(0, 0, -3);
    scene.add(butterfly);

    let lastTime = 0;
    renderer.setAnimationLoop(function animate(time) {
      const deltaTime = time - (lastTime || time);
      lastTime = time;
      renderer.render(scene, camera);
      butterfly.rotation.y += deltaTime / 2500;
    });
  });
</script>
