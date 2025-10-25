<script lang="ts">
  import SplatViewer from "$lib/components/splat-viewer.svelte";
  import Context from "$lib/components/context.svelte";
  import Media from "$lib/components/media.svelte";
  import Panorama from "$lib/components/panorama/panorama.svelte";
  import Hourglass from "$lib/components/hourglass.svelte";
  import { activeIndex, splatBlobUrl, panBlobUrl } from "$lib/stores/store";
</script>

{#if $splatBlobUrl}
  <SplatViewer />
{:else if $panBlobUrl}
  <Panorama />
{:else}
  <div
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl"
  >
    <div class="flex items-center gap-1"><Hourglass />Loading...</div>
  </div>
{/if}
<Media />
{#key $activeIndex}
  <Context />
{/key}
