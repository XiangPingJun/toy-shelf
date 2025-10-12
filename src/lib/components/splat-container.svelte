<script lang="ts">
  import SplatViewer from "./splat-viewer.svelte";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import { onMount } from "svelte";

  let splatUrl = $state("/duck.spz");
  let splatFile: ArrayBuffer | null = $state(null);

  $effect(() => {
    (async () => {
      splatFile = null;
      const response = await fetch(splatUrl);
      splatFile = await response.arrayBuffer();
    })();
  });

  let pos = $state({
    position: {
      x: 0.03791149930319798,
      y: 0.12157274398559176,
      z: 0.32679878545601243,
    },
    target: {
      x: 0.007827277372984302,
      y: 0.0068205051518288855,
      z: -0.0023828301507458306,
    },
  });

  onMount(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    pos = {
      position: {
        x: 0.33125401859207815,
        y: 0.13824258605717535,
        z: -0.025984789706860606,
      },
      target: {
        x: 0.007827277372984302,
        y: 0.0068205051518288855,
        z: -0.0023828301507458306,
      },
    };
  });
</script>

{#if splatFile}
  <SplatViewer {splatFile} cameraStateTarget={pos} />
{:else}
  <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <Spinner class="size-10" />
  </div>
{/if}
