<script lang="ts">
  import MinusIcon from "@lucide/svelte/icons/minus";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";

  let goal = $state(350);

  function handleClick(adjustment: number) {
    goal = Math.max(200, Math.min(400, goal + adjustment));
  }
</script>

<Drawer.Root class="p-4">
  1234
  <Drawer.Trigger
    class={[buttonVariants({ variant: "outline" }), "fixed bottom-2 left-2"]}
  >
    Open Drawer
  </Drawer.Trigger>
  <Drawer.Content>
    <div class="mx-auto w-full p-2">123</div>
  </Drawer.Content>
</Drawer.Root>
