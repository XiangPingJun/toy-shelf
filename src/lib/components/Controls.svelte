<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import BookImage from "@lucide/svelte/icons/book-image";
  import * as Item from "$lib/components/ui/item/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

  let { content } = $props();
</script>

<div class="fixed bottom-2 flex justify-center w-full pointer-events-none">
  <div class="w-4xl p-2 mx-2 flex flex-col gap-2 items-end">
    <Button variant="secondary" size="icon-lg">
      <BookImage />
    </Button>
    <!-- <Item.Root
      class="w-full transition-all duration-200 border-border bg-muted/50 pointer-events-auto"
    >
      {@render content?.()}
    </Item.Root> -->
    <ScrollArea
      class="w-full border-border bg-muted/50 rounded-md border p-4 pointer-events-auto"
    >
      Jokester began sneaking into the castle in the middle of the night and
      leaving jokes all over the place: under the king's pillow, in his soup,
      even in the royal toilet. The king was furious, but he couldn't seem to
      stop Jokester. And then, one day, the people of the kingdom discovered
      that the jokes left by Jokester were so funny that they couldn't help but
      laugh. And once they started laughing, they couldn't stop. Jokester began
      sneaking into the castle in the middle of the night and leaving jokes all
      over the place: under the king's pillow, in his soup, even in the royal
      toilet. The king was furious, but he couldn't seem to stop Jokester. And
      then, one day, the people of the kingdom discovered that the jokes left by
      Jokester were so funny that they couldn't help but laugh. And once they
      started laughing, they couldn't stop. Jokester began sneaking into the
      castle in the middle of the night and leaving jokes all over the place:
      under the king's pillow, in his soup, even in the royal toilet. The king
      was furious, but he couldn't seem to stop Jokester. And then, one day, the
      people of the kingdom discovered that the jokes left by Jokester were so
      funny that they couldn't help but laugh. And once they started laughing,
      they couldn't stop. Jokester began sneaking into the castle in the middle
      of the night and leaving jokes all over the place: under the king's
      pillow, in his soup, even in the royal toilet. The king was furious, but
      he couldn't seem to stop Jokester. And then, one day, the people of the
      kingdom discovered that the jokes left by Jokester were so funny that they
      couldn't help but laugh. And once they started laughing, they couldn't
      stop.
    </ScrollArea>
  </div>
</div>
