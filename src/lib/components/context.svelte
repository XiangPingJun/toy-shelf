<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  const { content } = $props();

  let visible = $state(false);
  onMount(() => {
    visible = true;
  });
</script>

{#if visible}
  <div class="fixed bottom-2 left-1/2 -translate-x-1/2">
    <div class="flex">
      <div
        class="rounded-tl-md border-t-3 border-l-3 border-white box-content h-[1em] bg-black/50 w-[2rem]"
      ></div>
      <div class="bg-black/50 -mt-2.5 px-2 font-bold">唐老鴨</div>
      <div
        class="rounded-tr-md border-t-3 border-r-3 border-white box-content h-[1em] bg-black/50 flex-grow"
      ></div>
    </div>
    <div
      class="notice max-w-2xl w-full h-[12rem] bg-black/50 rounded-md border-white border-t-0 rounded-t-none box-content border-3"
    >
      <div
        class="pl-4 pr-1 overflow-y-auto h-[11rem] whitespace-pre-line"
        transition:fly={{ y: 20 }}
      >
        {@render content?.()}
      </div>
    </div>
  </div>
{/if}
