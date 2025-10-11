<script lang="ts">
  import SplatViewer from "./SplatViewer.svelte";
  import { Spinner } from "$lib/components/ui/spinner/index.js";

  let splatUrl = $state("/justice.spz");
  let splatFile: ArrayBuffer | null = $state(null);

  $effect(() => {
    (async () => {
      const response = await fetch(splatUrl);
      splatFile = await response.arrayBuffer();
    })();
  });
</script>

{#if !splatFile}
  <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <Spinner class="size-10" />
  </div>
{/if}

<SplatViewer
  {splatFile}
  cameraState={{
    position: {
      x: 3.589601952942516,
      y: 3.930501030576014,
      z: -0.5083257790175351,
    },
    target: { x: 0, y: 0, z: 0 },
  }}
/>
