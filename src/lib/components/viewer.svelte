<script lang="ts">
  import SplatViewer from "$lib/components/splat-viewer.svelte";
  import Context from "$lib/components/context.svelte";
  import { onMount } from "svelte";

  let { splatUrl, pov, heading, content } = $props();
  let splatFile: ArrayBuffer | null = $state(null);
  let inited = $state(false);
  let loaderText = $state("");
  let loaderStep = $state(1);

  setInterval(() => {
    if (loaderStep > 3) {
      loaderStep = 0;
    }
    loaderText = "Loading" + ".".repeat(loaderStep);
    loaderStep++;
  }, 500);

  onMount(() => {
    inited = true;
  });

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
{:else if inited}
  <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
    <div>
      {loaderText}
    </div>
    <div class="invisible">Loading...</div>
  </div>
{/if}
