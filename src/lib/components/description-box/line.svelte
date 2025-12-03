<script lang="ts">
  import {
    pages,
    activePageIndex,
    activeLineIndex,
    activePage,
  } from "$lib/stores/store";
  import { goto } from "$app/navigation";
  import { fly } from "svelte/transition";
  import {
    splatPov,
    panPov,
    imgUrl,
    videoUrl,
    resources,
    autoRotate,
  } from "$lib/stores/store";

  const { text, isLast, isActive, maxHeight, pov } = $props();

  $effect(() => {
    if (!isActive) {
      return;
    }
    if (!pov) {
      return;
    }
    if ($activePage.type === "splat") {
      $splatPov = pov;
    } else if ($activePage.type === "pan") {
      $panPov = pov;
    }
  });
</script>

{#snippet navigateButton(text: string, iconClass: string, onclick: () => void)}
  <button
    class="text-blue-400 hover:text-blue-300 cursor-pointer font-[uoqmunthenkhung] underline-offset-4 underline mt-3"
    transition:fly={{ y: 24 }}
    {onclick}
  >
    <i class={[iconClass, "underline-offset-4 underline"]}></i>
    {text}
  </button>
{/snippet}

<div
  class={[
    "font-[uoqmunthenkhung] snap-start mb-2 transition-all duration-500",
    !isActive && "text-gray-400",
  ]}
  style:min-height={isLast && maxHeight}
  style="scroll-snap-stop: always;"
>
  {text}
  {#if isLast}
    <div></div>
    {#if isActive}
      {#if $activePageIndex < $pages.length - 1}
        {@render navigateButton(
          "下頁繼續...",
          "las la-arrow-right",
          () => $activePageIndex++,
        )}
      {:else if $pages.length === 1 || $activePageIndex === $pages.length - 1}
        {@render navigateButton("回到總覽", "las la-list", () => goto("/"))}
      {/if}
    {:else}
      ...
    {/if}
  {/if}
</div>
