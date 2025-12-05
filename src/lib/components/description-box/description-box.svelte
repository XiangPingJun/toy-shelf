<script lang="ts">
  import { goto } from "$app/navigation";
  import Description from "$lib/components/description-box/description.svelte";
  import {
    pages,
    activePage,
    activePageIndex,
    isPortrait,
  } from "$lib/stores/store";
</script>

<div
  class={[
    "fixed left-1/2 -translate-x-1/2 max-w-[40rem] w-[calc(100vw-1rem)]",
    isPortrait ? "bottom-3" : "bottom-12",
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
  <Description
    class="bg-black/75 border-white box-content border-l-3 border-r-3 whitespace-pre-line"
    maxHeight="10rem"
  />
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
