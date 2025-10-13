<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  const { content, title } = $props();

  let visible = $state(false);
  onMount(() => {
    visible = true;
  });
</script>

{#if visible}
  <div
    class={[
      "fixed left-1/2 -translate-x-1/2 max-w-[40rem] w-[calc(100vw-1rem)]",
      window.innerWidth < window.innerHeight ? "bottom-3" : "bottom-12",
    ]}
  >
    <div
      class="backdrop-blur-xs h-[13rem]"
      style="position: absolute; bottom: 0; z-index: -1;"
    ></div>
    <div class="flex">
      <div
        class="rounded-tl-md border-t-3 border-l-3 border-white box-content h-[1em] bg-black/50 w-[2rem]"
      ></div>
      <div class="bg-black/50 -mt-2.5 px-2 font-bold">{@render title()}</div>
      <div
        class="rounded-tr-md border-t-3 border-r-3 border-white box-content h-[1em] bg-black/50 flex-grow"
      ></div>
    </div>
    <div
      class="h-[12rem] bg-black/50 rounded-md border-white border-t-0 rounded-t-none box-content border-3"
    >
      <div
        class="pl-4 pr-1 overflow-y-auto h-[11rem] whitespace-pre-line"
        tabindex="-1"
        transition:fly={{ y: 30 }}
      >
        {@render content()}
      </div>
    </div>
  </div>
{/if}
