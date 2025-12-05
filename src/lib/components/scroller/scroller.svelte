<script lang="ts">
  import { isMobile } from "$lib/stores/store";
  import ScrollerMobile from "./scroller-mobile.svelte";
  import ScrollerDesktop from "./scroller-desktop.svelte";
  const props = $props();
</script>

{#if $isMobile}
  <ScrollerMobile {...props}>
    {@render props.children()}
  </ScrollerMobile>
{:else}
  <ScrollerDesktop {...props}>
    {@render props.children()}
  </ScrollerDesktop>
{/if}
