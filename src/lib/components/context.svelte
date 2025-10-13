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
  <div
    class="fixed bottom-3 px-2 flex justify-center w-full whitespace-pre-line"
    transition:fly={{ y: 20 }}
  >
    <p
      class="notice max-w-2xl w-[calc(100vw - 4)] pointer-events-auto max-h-[12rem] backdrop-blur-4 overflow-y-auto"
    >
      {@render content?.()}
    </p>
  </div>
{/if}
