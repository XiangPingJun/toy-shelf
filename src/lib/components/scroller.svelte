<script lang="ts">
  const isMobile = window.matchMedia("(pointer: coarse)").matches;
  import ScrollerMobile from "./scroller-mobile.svelte";
  import ScrollerDesktop from "./scroller-desktop.svelte";
  const props = $props();
</script>

{#if isMobile}
  <ScrollerMobile {...props} />
{:else}
  <ScrollerDesktop {...props} />
{/if}
