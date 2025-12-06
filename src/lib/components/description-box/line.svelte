<script lang="ts">
  import { pages, activePageIndex, activePage } from "$lib/stores/store";
  import { goto } from "$app/navigation";
  import { fly } from "svelte/transition";
  import {
    splatPov,
    panPov,
    imgUrl,
    videoUrl,
    resources,
  } from "$lib/stores/store";
  import Hourglass from "$lib/components/hourglass.svelte";

  let props = $props();
  let loading = $state(false);

  $effect(() => {
    if (!props.isActive) {
      return;
    }
    if (props.pov) {
      switch ($activePage.type) {
        case "splat":
          $splatPov = props.pov;
          break;
        case "pan":
          $panPov = props.pov;
          break;
      }
    }

    $imgUrl = props.imgUrl ?? "";
    $videoUrl = props.videoUrl ?? "";
  });

  $effect(() => {
    loading =
      (props.imgUrl && !$resources[props.imgUrl]) ||
      (props.videoUrl && !$resources[props.videoUrl]);
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
    !props.isActive && "text-gray-400",
  ]}
  style:min-height={props.isLast ? props.height : undefined}
  style="scroll-snap-stop: always;"
>
  {#if props.isActive}
    {#if loading}
      <Hourglass />
    {:else}
      <i class="las la-paper-plane"></i>
    {/if}
  {/if}
  {props.text}
  {#if props.isLast}
    <div></div>
    {#if props.isActive}
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
