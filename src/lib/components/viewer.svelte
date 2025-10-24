<script lang="ts">
  import SplatViewer from "$lib/components/splat-viewer.svelte";
  import Context from "$lib/components/context.svelte";
  import Media from "$lib/components/media.svelte";
  import Panorama from "$lib/components/panorama/panorama.svelte";
  import Hourglass from "$lib/components/hourglass.svelte";

  let { content, onNext = null, onPrev = null } = $props();
  import { splatBlobUrl, panBlobUrl } from "$lib/stores/store";
</script>

{#if !$splatBlobUrl && !$panBlobUrl}
  <div
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl"
  >
    <div class="flex items-center gap-1"><Hourglass />Loading...</div>
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
