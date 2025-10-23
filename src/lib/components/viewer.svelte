<script lang="ts">
  import SplatViewer from "$lib/components/splat-viewer.svelte";
  import Context from "$lib/components/context.svelte";
  import Media from "$lib/components/media.svelte";
  import Panorama from "$lib/components/panorama/panorama.svelte";
  import { splatBlobUrl, panBlobUrl } from "$lib/stores/store";

  let { content, onNext = null, onPrev = null } = $props();
  let loaderText = $state("");
  let loaderStep = $state(1);

  setInterval(() => {
    if (loaderStep > 3) {
      loaderStep = 0;
    }
    loaderText = "Loading" + ".".repeat(loaderStep);
    loaderStep++;
  }, 500);
</script>

{#if !$splatBlobUrl && !$panBlobUrl}
  <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
    <div>
      {loaderText}
    </div>
    <div class="invisible">Loading...</div>
  </div>
{:else}
  {#if $splatBlobUrl}
    <SplatViewer />
  {:else if $panBlobUrl}
    <Panorama />
  {/if}
  <Media />
  <Context {content} {onNext} {onPrev} />
{/if}
