<script lang="ts">
  import GsViewer from "$lib/components/gs-viewer/gs-viewer.svelte";
  import Context from "$lib/components/context.svelte";
  import Media from "$lib/components/media.svelte";
  import Panorama from "$lib/components/panorama/panorama.svelte";
  import Hourglass from "$lib/components/hourglass.svelte";
  import { activePage, activeIndex, resources } from "$lib/stores/store";

  $activeIndex = 0;
</script>

{#key $activePage}
  {#if !$resources[$activePage.url]}
    <div
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl"
    >
      <div class="flex items-center gap-1"><Hourglass />載入中...</div>
    </div>
  {:else if $activePage?.type === "splat"}
    <GsViewer url="/v/gs.compressed.ply" />
  {:else if $activePage?.type === "pan"}
    <Panorama />
  {/if}
  <Media />
  <Context />
{/key}
