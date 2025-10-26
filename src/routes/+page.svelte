<script lang="ts">
  const modules = import.meta.glob("./v/**/v/description.ts", {
    eager: true,
  });
  import Scroller from "$lib/components/scroller/scroller.svelte";
  import { blur } from "svelte/transition";
  import { onMount } from "svelte";

  export const title = "(^ω^)祥平的玩具櫃";
  const description =
    "從迪士尼到寶塚大劇場、從台北跨年到渋谷清真寺。從看不到的角落，撿回日常裡被磨掉的心動。";
  const ogImage = "og-image.jpg";

  let data = $state([] as Record<string, string>[]);
  onMount(() => {
    data = [
      ...Object.entries(modules),
      ...Object.entries(modules),
      ...Object.entries(modules),
      ...Object.entries(modules),
      ...Object.entries(modules),
      ...Object.entries(modules),
      ...Object.entries(modules),
      ...Object.entries(modules),
      ...Object.entries(modules),
      ...Object.entries(modules),
      ...Object.entries(modules),
      ...Object.entries(modules),
      ...Object.entries(modules),
    ].map(([path, mod]) => ({
      path,
      caption: (mod as { default: string }).default,
    }));
  });
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />

  <!-- Open Graph Protocol -->
  <meta property="og:title" content="(^ω^)祥平的玩具櫃" />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="(^ω^)祥平的玩具櫃" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />
</svelte:head>

<div class="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
  <Scroller class="max-w-[40rem] w-[100vw]" maxHeight="calc(100dvh - 2rem)">
    {#each data as { path, caption }, i}
      <div
        class="relative inline-block cursor-pointer"
        transition:blur={{ delay: i * 30 }}
      >
        <img
          src={`${/(\/v\/.*)\/v\//.exec(path)?.[1]}/og-image.jpg`}
          class="max-w-[18rem] w-[calc(50vw-2rem)] m-1 inline rounded-md"
          alt=""
        />
        <div
          class="font-[uoqmunthenkhung] absolute bottom-[4px] left-[4px] text-sm w-[calc(100%-8px)] caption"
          style="background: linear-gradient(#0000 0%, #0009 25%, #000A 50%, #0009 100%); padding: 1rem .5rem .25rem 1rem;"
        >
          <div
            class="w-full text-nowrap overflow-hidden text-ellipsis backdrop-blur-sm blur-bg"
          >
            ❝{caption}❞
          </div>
        </div>
      </div>
    {/each}
  </Scroller>
</div>

<style>
  .caption::-webkit-scrollbar {
    width: 0;
    display: none;
  }
</style>
