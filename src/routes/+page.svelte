<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import Undo from "@lucide/svelte/icons/undo";
  import BookImage from "@lucide/svelte/icons/book-image";
  import SplatContainer from "$lib/components/SplatContainer.svelte";
  import * as Item from "$lib/components/ui/item/index.js";
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import { fade, fly } from "svelte/transition";
</script>

<SplatContainer />

<div
  class="fixed bottom-2 flex justify-center w-full"
  in:fly={{ duration: 400 }}
>
  <div class="w-6xl p-2 mx-2 flex flex-col gap-2 items-end">
    <ButtonGroup.Root orientation="vertical">
      <Button variant="secondary" size="icon-sm">
        <Undo />
      </Button>
      <ButtonGroup.Separator />
      <Button variant="secondary" size="icon-sm">
        <BookImage />
      </Button>
    </ButtonGroup.Root>
    <Item.Root
      class="w-full transition-all duration-200 border-border bg-muted/50"
    >
      <Item.Content>A simple item with title and description.</Item.Content>
    </Item.Root>
  </div>
</div>
