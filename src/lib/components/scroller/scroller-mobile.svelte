<script lang="ts">
  import { browser } from "$app/environment";
  const isMobile = browser && window?.matchMedia("(pointer: coarse)").matches;
  const props = $props();
</script>
