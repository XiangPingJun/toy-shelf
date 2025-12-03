<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Scroller from "$lib/components/scroller/scroller.svelte";
  import { activePage, activeLineIndex } from "$lib/stores/store";
  import Line from "$lib/components/description-box/line.svelte";

  const props = $props();
  const lineRefs: HTMLDivElement[] = [];
  const intersectingLineIndexes: boolean[] = [];
  let intersectionObserver: IntersectionObserver;

  onMount(() => {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((it) => {
          const index = Number(it.target.getAttribute("data-index"));
          if (it.isIntersecting) {
            intersectingLineIndexes[index] = true;
          } else {
            delete intersectingLineIndexes[index];
          }
        });
        const index = intersectingLineIndexes.findIndex((it) => it);
        if (index < 0) {
          return;
        }
        $activeLineIndex = index;
      },
      {
        threshold: 1,
      },
    );
    lineRefs.forEach((it) => intersectionObserver.observe(it));
  });

  onDestroy(() => {
    intersectionObserver?.disconnect();
  });
</script>

<Scroller {...props}>
  {#each $activePage.lines as line, i}
    <div bind:this={lineRefs[i]} data-index={i}>
      <Line
        {...line}
        isLast={i === $activePage.lines.length - 1}
        isActive={i === $activeLineIndex}
        maxHeight={props.maxHeight}
      />
    </div>
  {/each}
</Scroller>
