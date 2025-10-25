<script lang="ts">
  const modules = import.meta.glob("./v/**/v/+page.svelte", { eager: true });
  import Scroller from "$lib/components/scroller.svelte";
  console.log(modules);
</script>

<div
  class="fixed left-1/2 -translate-x-1/2 max-w-[40rem] w-[calc(100vw-1rem)] max-h-[100dvh-2rem]"
>
  <Scroller maxHeight="100dvh">
    {#each [...Object.entries(modules), ...Object.entries(modules), ...Object.entries(modules), ...Object.entries(modules), ...Object.entries(modules), ...Object.entries(modules), ...Object.entries(modules), ...Object.entries(modules)] as [path, mod]}
      <img
        src={`${/(\/v\/.*)\/v\//.exec(path)?.[1]}/og-image.jpg`}
        style="mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmb3JlaWduT2JqZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxib2R5IGNsYXNzPSJ3cmFwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCI+PHN0eWxlPi53cmFwe2JveC1zaXppbmc6Ym9yZGVyLWJveDttYXJnaW46MDtoZWlnaHQ6MTAwJTtwYWRkaW5nOjNweH0uc2hhZG93e2hlaWdodDoxMDAlO2JhY2tncm91bmQ6IzAwMDtib3JkZXItcmFkaXVzOjNweDtib3gtc2hhZG93OjAgMCAzcHggIzAwMCwwIDAgNnB4ICMwMDAsMCAwIDlweCAjMDAwfTwvc3R5bGU+PGRpdiBjbGFzcz0ic2hhZG93Ii8+PC9ib2R5PjwvZm9yZWlnbk9iamVjdD48L3N2Zz4=);"
        alt=""
      />
    {/each}
  </Scroller>
</div>

<style scoped>
</style>
