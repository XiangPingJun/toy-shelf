<script lang="ts">
  import { goto } from "$app/navigation";
  import Content from "./content.svelte";
  import { browser } from "$app/environment";
  import {
    pages,
    activePage,
    resources,
    activePageIndex,
    imgUrl,
    videoUrl,
  } from "$lib/stores/store";
  import { onMount } from "svelte";

  let mounted = $state(false);
  let isPortrait = $state(false);

  onMount(() => {
    mounted = true;
  });

  // 監聽視窗大小變化
  $effect(() => {
    if (!browser) return;

    const updateOrientation = () => {
      isPortrait = window.innerWidth < window.innerHeight;
    };

    updateOrientation();
    window.addEventListener("resize", updateOrientation);

    return () => {
      window.removeEventListener("resize", updateOrientation);
    };
  });
</script>

<div
  class={[
    "fixed left-1/2 -translate-x-1/2 max-w-[40rem] w-[calc(100vw-1rem)] slide",
    isPortrait ? "bottom-3" : "bottom-12",
    $resources[$imgUrl] || $resources[$videoUrl] ? "pointer-events-none" : "in",
    mounted ? "" : "invisible",
  ]}
>
  <div
    class={[
      "backdrop-blur-xs absolute top-[0.2rem] w-full -z-10",
      $pages.length > 1 ? "h-[calc(100%-1rem)]" : "h-full",
    ]}
  ></div>
  <div class="flex">
    <div
      class="rounded-tl-md border-t-3 border-l-3 border-white box-content h-[1em] bg-black/75 w-[2rem]"
    ></div>
    <div class="bg-black/75 -mt-2.5 px-0.5">
      <div class="flex items-center">
        [{$activePage?.title}]
      </div>
    </div>
    <div
      class="rounded-tr-md border-t-3 border-r-3 border-white box-content h-[1em] bg-black/75 flex-grow"
    ></div>
  </div>
  <Content
    class="bg-black/75 border-white box-content border-l-3 border-r-3 whitespace-pre-line max-h-10rem"
  />
  <!-- {#if $activePageIndex < $pages.length - 1}
    <button
      class="text-blue-400 hover:text-blue-300 cursor-pointer font-[uoqmunthenkhung] underline-offset-4 underline block my-2"
      onclick={() => $activePageIndex++}
    >
      <i class="las la-arrow-right underline-offset-4 underline"></i>下頁繼續...
    </button>
  {:else if $pages.length === 1 || $activePageIndex === $pages.length - 1}
    <button
      class="text-blue-400 hover:text-blue-300 cursor-pointer font-[uoqmunthenkhung] underline-offset-4 underline block my-2"
      onclick={() => goto("/")}
    >
      <i class="las la-list underline-offset-4 underline"></i> 回到總覽
    </button>
  {/if} -->
  <div class="flex">
    <div
      class="rounded-bl-md border-b-3 border-l-3 border-white box-content h-[1em] bg-black/75 flex-grow"
    ></div>
    <div class="bg-black/75 pt-1.25 px-0.5 flex items-center">
      {#if $activePageIndex === 0}
        [<button
          class="text-blue-400 hover:text-blue-300 cursor-pointer mx-1 flex items-center gap-0.5"
          onclick={() => goto("/")}
        >
          <i class="las la-list"></i>
          總覽
        </button>]
      {:else if $activePageIndex > 0}
        [<button
          class="text-blue-400 hover:text-blue-300 cursor-pointer mx-1 flex items-center"
          onclick={() => $activePageIndex--}
        >
          <i class="las la-arrow-left"></i>
          上頁
        </button>]
      {/if}
      {#if $activePageIndex < $pages.length - 1}
        [<button
          class="text-blue-400 hover:text-blue-300 cursor-pointer mx-1 flex items-center"
          onclick={() => $activePageIndex++}
        >
          下頁
          <i class="las la-arrow-right"></i>
        </button>]
      {:else if $pages.length > 1 && $activePageIndex === $pages.length - 1}
        [<button
          class="text-blue-400 hover:text-blue-300 cursor-pointer mx-1 flex items-center gap-0.5"
          onclick={() => goto("/")}
        >
          <i class="las la-list"></i>
          總覽
        </button>]
      {/if}
    </div>
    <div
      class="rounded-br-md border-b-3 border-r-3 border-white box-content h-[1em] bg-black/75 w-[2rem]"
    ></div>
  </div>
</div>

<style>
  .slide {
    display: grid;
    clip-path: inset(100% 0 0 0); /* 從上方遮住內容 */
    transition: all 0.25s ease-out;
  }

  .slide.in {
    clip-path: inset(-1rem 0 0 0); /* 解除遮罩 */
  }
</style>
