<script lang="ts">
  import { imgUrl } from "$lib/stores/store";
  import { slide } from "svelte/transition";
  let imgLoaded = $state(false);
</script>

<img class="hidden" alt="" src={$imgUrl} onload={() => (imgLoaded = true)} />

{#if $imgUrl && imgLoaded}
  <div
    class={[
      "fixed left-1/2 -translate-x-1/2",
      window.innerWidth < window.innerHeight ? "top-3" : "top-12",
    ]}
    transition:slide
  >
    <div>
      <div class="backdrop-blur-xs top-[0.2rem] absolute bottom-0 -z-10"></div>
      <div
        class="rounded-tl-md rounded-tr-md border-3 border-b-0 border-white box-content bg-black/50 p-4 pb-0"
      >
        <img
          src={$imgUrl}
          class="max-w-[min(1360px,100vw,100%)] max-h-[min(calc(600px-8rem),calc(100dvh-8rem),100%)] object-cover backdrop-blur-sm"
          style="mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmb3JlaWduT2JqZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxib2R5IGNsYXNzPSJ3cmFwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCI+PHN0eWxlPi53cmFwe2JveC1zaXppbmc6Ym9yZGVyLWJveDttYXJnaW46MDtoZWlnaHQ6MTAwJTtwYWRkaW5nOjNweH0uc2hhZG93e2hlaWdodDoxMDAlO2JhY2tncm91bmQ6IzAwMDtib3JkZXItcmFkaXVzOjNweDtib3gtc2hhZG93OjAgMCAzcHggIzAwMCwwIDAgNnB4ICMwMDAsMCAwIDlweCAjMDAwfTwvc3R5bGU+PGRpdiBjbGFzcz0ic2hhZG93Ii8+PC9ib2R5PjwvZm9yZWlnbk9iamVjdD48L3N2Zz4=);"
          alt=""
        />
      </div>
      <div class="flex">
        <div
          class="rounded-bl-md border-b-3 border-l-3 border-white box-content h-[1em] bg-black/50 flex-grow"
        ></div>
        <div class="bg-black/50 pt-1.25 px-0.5 font-bold flex items-center">
          [<button
            class="text-blue-400 hover:text-blue-300 cursor-pointer mx-1 flex gap-1 items-center"
            onclick={() => {
              $imgUrl = "";
              imgLoaded = false;
            }}
            ><i class="far fa-window-close"></i>
            關閉</button
          >]
        </div>
        <div
          class="rounded-br-md border-b-3 border-r-3 border-white box-content h-[1em] bg-black/50 w-[2rem]"
        ></div>
      </div>
    </div>
  </div>
{/if}
