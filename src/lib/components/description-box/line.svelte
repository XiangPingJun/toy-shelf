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

<div
  class={[
    "font-[uoqmunthenkhung] snap-start mb-2",
    !isActive && "text-gray-400",
  ]}
  style:min-height={isLast && maxHeight}
  style="scroll-snap-stop: always;"
>
  {text}
  {#if isLast && isActive && $activePageIndex < $pages.length - 1}
    <button
      class="text-blue-400 hover:text-blue-300 cursor-pointer font-[uoqmunthenkhung] underline-offset-4 underline block mt-4"
      transition:fly={{ y: 24 }}
      onclick={() => $activePageIndex++}
    >
      <i class="las la-arrow-right underline-offset-4 underline"></i> 下頁繼續...
    </button>
  {:else if isLast && isActive && ($pages.length === 1 || $activePageIndex === $pages.length - 1)}
    <button
      class="text-blue-400 hover:text-blue-300 cursor-pointer font-[uoqmunthenkhung] underline-offset-4 underline block mt-4"
      onclick={() => goto("/")}
      transition:fly={{ y: 24 }}
    >
      <i class="las la-list underline-offset-4 underline"></i> 回到總覽
    </button>
  {/if}
</div>
