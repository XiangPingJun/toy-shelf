<script lang="ts">
  import SplatViewer from "$lib/components/splat-viewer.svelte";
  import Context from "$lib/components/context.svelte";
  import Image from "$lib/components/image.svelte";
  import Panorama from "$lib/components/panorama/panorama.svelte";

  let {
    splatUrl = "",
    panoramaUrl = "",
    pov,
    heading,
    content,
    imgUrl = "",
    onImgClose = () => {},
    onNext = null,
    onPrev = null,
  } = $props();
  let splatFile: ArrayBuffer | null = $state(null);
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
      splatFile = null;
      const response = await fetch(splatUrl);
      splatFile = await response.arrayBuffer();
    })();
  });
</script>

{#if splatUrl && !splatFile}
  <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
    <div>
      {loaderText}
    </div>
    <div class="invisible">Loading...</div>
  </div>
{:else}
  {#if splatUrl}
    <SplatViewer {splatFile} {pov} />
  {:else if panoramaUrl}
    <Panorama src={panoramaUrl} {pov} />
  {/if}
  <Context {content} {heading} />
  {#if imgUrl}
    <Image src={imgUrl} onClose={onImgClose} />
  {/if}
{/if}
