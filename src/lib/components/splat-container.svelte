<script lang="ts">
  import SplatViewer from "./splat-viewer.svelte";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import { onMount } from "svelte";

  let splatUrl = $state("/duck.spz");
  let splatFile: ArrayBuffer | null = $state(null);
  let pov = $state({
    camPos: [0.055985, 0.040282, 0.300185],
    ctrlTgt: [0.002496, 0.001228, -0.000562],
  });

  $effect(() => {
    (async () => {
      splatFile = null;
      const response = await fetch(splatUrl);
      splatFile = await response.arrayBuffer();
    })();
  });

  onMount(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    pov = {
      camPos: [0.2552, 0.065698, -0.157092],
      ctrlTgt: [0.002496, 0.001228, -0.000562],
    };
  });
</script>

{#if splatFile}
  <SplatViewer {splatFile} {pov} />
{:else}
  <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <Spinner class="size-10" />
  </div>
{/if}
