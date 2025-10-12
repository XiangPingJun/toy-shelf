<script lang="ts">
  import * as Item from "$lib/components/ui/item/index.js";
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
    class="fixed bottom-2 px-2 flex justify-center w-full"
    transition:fly={{ y: 20 }}
  >
    <Item.Root
      class="max-w-2xl w-[calc(100vw - 4)] border-border bg-muted/50 rounded-md pointer-events-auto max-h-[11.5rem] p-3 backdrop-blur-4 overflow-y-auto"
    >
      {@render content?.()}
    </Item.Root>
  </div>
{/if}
