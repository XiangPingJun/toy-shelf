<script lang="ts">
  import { imgUrl, videoUrl, resources } from "$lib/stores/store";
  import { fly } from "svelte/transition";
</script>

{#if ($imgUrl && $resources[$imgUrl]) || ($videoUrl && $resources[$videoUrl])}
  <div
    class={[
      "fixed left-1/2 -translate-x-1/2",
      window.innerWidth < window.innerHeight ? "top-3" : "top-12",
    ]}
    transition:fly={{ y: "2rem" }}
  >
    <div
      class="backdrop-blur-xs absolute top-[0.2rem] w-full h-[calc(100%-1rem)] -z-10"
    ></div>
    <div
      class="rounded-tl-md rounded-tr-md border-3 border-b-0 border-white box-content bg-black/50 p-2 pb-0"
    >
      {#if $resources[$imgUrl]}
        <img
          src={$resources[$imgUrl]}
          class="max-w-[min(1360px,calc(100vw-2rem))] max-h-[min(600px,calc(100dvh-2rem))] object-cover backdrop-blur-sm"
          style="mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmb3JlaWduT2JqZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxib2R5IGNsYXNzPSJ3cmFwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCI+PHN0eWxlPi53cmFwe2JveC1zaXppbmc6Ym9yZGVyLWJveDttYXJnaW46MDtoZWlnaHQ6MTAwJTtwYWRkaW5nOjNweH0uc2hhZG93e2hlaWdodDoxMDAlO2JhY2tncm91bmQ6IzAwMDtib3JkZXItcmFkaXVzOjNweDtib3gtc2hhZG93OjAgMCAzcHggIzAwMCwwIDAgNnB4ICMwMDAsMCAwIDlweCAjMDAwfTwvc3R5bGU+PGRpdiBjbGFzcz0ic2hhZG93Ii8+PC9ib2R5PjwvZm9yZWlnbk9iamVjdD48L3N2Zz4=);"
          alt=""
        />
      {:else if $resources[$videoUrl]}
        <video
          src={$resources[$videoUrl]}
          class="max-w-[min(1360px,calc(100vw-2rem))] max-h-[min(600px,calc(100dvh-2rem))] object-cover backdrop-blur-sm"
          style="mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmb3JlaWduT2JqZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxib2R5IGNsYXNzPSJ3cmFwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCI+PHN0eWxlPi53cmFwe2JveC1zaXppbmc6Ym9yZGVyLWJveDttYXJnaW46MDtoZWlnaHQ6MTAwJTtwYWRkaW5nOjNweH0uc2hhZG93e2hlaWdodDoxMDAlO2JhY2tncm91bmQ6IzAwMDtib3JkZXItcmFkaXVzOjNweDtib3gtc2hhZG93OjAgMCAzcHggIzAwMCwwIDAgNnB4ICMwMDAsMCAwIDlweCAjMDAwfTwvc3R5bGU+PGRpdiBjbGFzcz0ic2hhZG93Ii8+PC9ib2R5PjwvZm9yZWlnbk9iamVjdD48L3N2Zz4=);"
          autoplay
          muted
          playsinline
          loop
        >
          <track kind="captions" />
        </video>
      {/if}
    </div>
    <div class="flex">
      <div
        class="rounded-bl-md border-b-3 border-l-3 border-white box-content h-[1em] bg-black/50 flex-grow"
      ></div>
      <div class="bg-black/50 pt-1.25 px-0.5 font-bold flex items-center">
        [<button
          class="text-blue-400 hover:text-blue-300 cursor-pointer flex gap-1 items-center"
          onclick={() => {
            $imgUrl = "";
            $videoUrl = "";
          }}><i class="las la-window-close"></i>關閉</button
        >]
      </div>
      <div
        class="rounded-br-md border-b-3 border-r-3 border-white box-content h-[1em] bg-black/50 w-[2rem]"
      ></div>
    </div>
  </div>
{/if}
