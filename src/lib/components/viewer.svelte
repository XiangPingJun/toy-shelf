<script lang="ts">
  import SplatViewer from "$lib/components/splat-viewer.svelte";
  import Context from "$lib/components/context.svelte";
  import Media from "$lib/components/media.svelte";
  import Panorama from "$lib/components/panorama/panorama.svelte";
  import * as THREE from "three";
  import { splatUrl, panUrl, heading, imgUrl } from "$lib/stores/store";

  let { content, onNext = null, onPrev = null } = $props();
  let splatFile: ArrayBuffer | null = $state(null);
  let panTexture: THREE.Texture | null = $state(null);
  let loaderText = $state("");
  let loaderStep = $state(1);

  setInterval(() => {
    if (loaderStep > 3) {
      loaderStep = 0;
    }
    loaderText = "Loading" + ".".repeat(loaderStep);
    loaderStep++;
  }, 500);

  $effect(() => {
    (async () => {
      if ($splatUrl) {
        splatFile = null;
        const response = await fetch($splatUrl);
        splatFile = await response.arrayBuffer();
      }
    })();
  });

  $effect(() => {
    (async () => {
      if ($panUrl) {
        panTexture = null;
        panTexture = await new THREE.TextureLoader().loadAsync($panUrl);
      }
    })();
  });
</script>

{#if ($splatUrl && !splatFile) || ($panUrl && !panTexture)}
  <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
    <div>
      {loaderText}
    </div>
    <div class="invisible">Loading...</div>
  </div>
{:else}
  {#if splatFile}
    <SplatViewer {splatFile} />
  {:else if panTexture}
    <Panorama {panTexture} />
  {/if}
  <Media />
  <Context {content} />
{/if}
