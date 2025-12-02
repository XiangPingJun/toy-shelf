<script lang="ts">
  import { browser } from "$app/environment";
  const isMobile = browser && window?.matchMedia("(pointer: coarse)").matches;
  import ContentMobile from "./content-mobile.svelte";
  import ContentDesktop from "./content-desktop.svelte";
  const props = $props();
</script>

{#if isMobile}
  <ContentMobile {...props} />
{:else}
  <ContentDesktop {...props} />
{/if}
