<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import FolderClosed from "@lucide/svelte/icons/folder-closed";
  import SplatViewer from "$lib/components/SplatViewer.svelte";
  import * as Item from "$lib/components/ui/item/index.js";
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  let splatURL = "/ggun.zip";
</script>

<!-- <Drawer.Root class="p-4">
  1234
  <Drawer.Trigger
    class={[buttonVariants({ variant: "outline" }), "fixed bottom-2 left-2"]}
  >
    Open Drawer
  </Drawer.Trigger>
  <Drawer.Content>
    <div class="mx-auto w-full p-2">123</div>
  </Drawer.Content>
</Drawer.Root> -->

<SplatViewer {splatURL} />

<div class="fixed bottom-2 flex justify-center w-full">
  <Item.Root
    variant="muted"
    class="w-6xl mx-2 transition-all duration-200 gap-0"
  >
    <Item.Content>A simple item with title and description.</Item.Content>
    <Item.Actions>
      <ButtonGroup.Root class="hidden sm:flex">
        <Button variant="outline" size="icon" class="size-8">
          <ChevronLeft />
        </Button>
        <Button variant="outline" size="icon" class="size-8">
          <FolderClosed />
        </Button>
        <Button variant="outline" size="icon" class="size-8">
          <ChevronRight />
        </Button>
      </ButtonGroup.Root>
    </Item.Actions>
  </Item.Root>
</div>
