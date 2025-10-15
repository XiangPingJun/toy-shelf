<script lang="ts">
  const { src, onClose } = $props();
  import { fly } from "svelte/transition";
  let inited = $state(false);
</script>

<img class="hidden" alt="" {src} onload={() => (inited = true)} />
{#if inited}
  <div
    class="fixed top-0 left-0 w-full h-full backdrop-blur-sm cursor-pointer"
    tabindex="-1"
    role="button"
    onmousedown={onClose}
    ontouchstart={onClose}
  ></div>
  <!-- svelte-ignore a11y_unknown_role -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer"
    tabindex="-1"
    onmousedown={onClose}
    ontouchstart={onClose}
    transition:fly={{ y: "2rem" }}
  >
    <img
      {src}
      class="max-w-[min(1360px,100vw,100%)] max-h-[min(calc(600px-8rem),calc(100dvh-8rem),100%)] object-cover backdrop-blur-sm mb-1"
      style="mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmb3JlaWduT2JqZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxib2R5IGNsYXNzPSJ3cmFwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCI+PHN0eWxlPi53cmFwe2JveC1zaXppbmc6Ym9yZGVyLWJveDttYXJnaW46MDtoZWlnaHQ6MTAwJTtwYWRkaW5nOjNweH0uc2hhZG93e2hlaWdodDoxMDAlO2JhY2tncm91bmQ6IzAwMDtib3JkZXItcmFkaXVzOjNweDtib3gtc2hhZG93OjAgMCAzcHggIzAwMCwwIDAgNnB4ICMwMDAsMCAwIDlweCAjMDAwfTwvc3R5bGU+PGRpdiBjbGFzcz0ic2hhZG93Ii8+PC9ib2R5PjwvZm9yZWlnbk9iamVjdD48L3N2Zz4=);"
      alt=""
    />
  </div>
{/if}
