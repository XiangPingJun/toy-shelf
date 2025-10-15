<script lang="ts">
  import SplatViewer from "$lib/components/splat-viewer.svelte";
  import Context from "$lib/components/context.svelte";
  import Image from "$lib/components/image.svelte";

  let {
    splatUrl = "",
    pov,
    heading,
    content,
    imgUrl = "",
    onImgClose = () => {},
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

{#if splatUrl && splatFile}
  <SplatViewer {splatFile} {pov} />
  <Context {content} {heading} />
  {#if imgUrl}
    <Image src={imgUrl} onClose={onImgClose} />
  {/if}
{:else}
  <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
    <div>
      {loaderText}
    </div>
    <div class="invisible">Loading...</div>
  </div>
{/if}
