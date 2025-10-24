<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  const props = $props();
  const { children, maxHeight } = props;

  let track: HTMLDivElement = $state() as HTMLDivElement;
  let thumb: HTMLDivElement = $state() as HTMLDivElement;
  let container: HTMLDivElement = $state() as HTMLDivElement;
  let content: HTMLDivElement = $state() as HTMLDivElement;
  let thumbHeight = $state(0);
  let thumbTop = $state(0);
  let showScroll = $state(false);

  const updateScrollbar = () => {
    thumbHeight =
      (container.clientHeight / container.scrollHeight) * track.clientHeight;
    showScroll = thumbHeight < track.clientHeight;
    const scrollProportion =
      container.scrollTop / (container.scrollHeight - container.clientHeight);
    thumbTop = scrollProportion * (track.clientHeight - thumbHeight);
  };

  const resizeObserver = new ResizeObserver(() => {
    updateScrollbar();
  });

  onMount(() => {
    resizeObserver.observe(content);
    updateScrollbar();
  });

  onDestroy(() => {
    resizeObserver.disconnect();
  });
</script>

<div class="relative">
  <div
    bind:this={container}
    class={["scrollbar-container", props.class]}
    style="max-height: {maxHeight};"
    onscroll={updateScrollbar}
  >
    <div bind:this={content} class="px-4 whitespace-pre-line">
      {@render children()}
    </div>

    <div
      bind:this={track}
      class="scrollbar-track"
      style="opacity: {showScroll ? 1 : 0}"
    >
      <div
        bind:this={thumb}
        class="scrollbar-thumb"
        style="height: {thumbHeight}px; top: {thumbTop}px;"
      ></div>
    </div>
  </div>
</div>

<style>
  .scrollbar-container {
    overflow-y: auto;
  }

  .scrollbar-container::-webkit-scrollbar {
    width: 0;
    display: none;
  }

  .scrollbar-track {
    position: absolute;
    top: 0;
    right: 0.5rem;
    border-radius: 0.5rem;
    background: #333;
    width: 0.5rem;
    height: 100%;
  }

  .scrollbar-thumb {
    position: absolute;
    right: 0;
    width: 0.5rem;
    background: #999;
    border-radius: 0.5rem;
  }
</style>
