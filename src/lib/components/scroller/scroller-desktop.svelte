<script lang="ts">
  import { onMount } from "svelte";

  const props = $props();
  let container: HTMLDivElement;

  onMount(() => {
    container.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();

        const direction = Math.sign(event.deltaY);
        const scrollAmount = direction * 24;

        container.scrollBy({
          top: scrollAmount,
        });
      },
      { passive: false },
    );
  });
</script>

<div class={props.class}>
  <div
    class="scrollbar-container pl-4 pr-2 mr-2"
    style:max-height={props.maxHeight}
    bind:this={container}
    onscroll={props.onScroll}
  >
    {@render props.children()}
  </div>
</div>

<style>
  .scrollbar-container {
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
  }

  .scrollbar-container::-webkit-scrollbar {
    width: 0.5rem;
  }

  .scrollbar-container::-webkit-scrollbar-track {
    background-color: #333;
    border-radius: 0.5rem;
  }

  .scrollbar-container::-webkit-scrollbar-thumb {
    background-color: #999;
    border-radius: 0.5rem;
  }
</style>
