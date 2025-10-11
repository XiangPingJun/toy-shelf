<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import ChevronUp from "@lucide/svelte/icons/chevron-up";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
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
  <div class="w-6xl p-2 mx-2 flex flex-col gap-2 items-end">
    <ButtonGroup.Root orientation="vertical">
      <Button variant="secondary" size="icon-sm">
        <ChevronUp />
      </Button>
      <ButtonGroup.Separator />
      <Button variant="secondary" size="icon-sm">
        <FolderClosed />
      </Button>
      <ButtonGroup.Separator />
      <Button variant="secondary" size="icon-sm">
        <ChevronDown />
      </Button>
    </ButtonGroup.Root>
    <Item.Root
      variant="muted"
      class="w-full transition-all duration-200 border-border"
    >
      <Item.Content>A simple item with title and description.</Item.Content>
    </Item.Root>
  </div>
</div>
