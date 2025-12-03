<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Scroller from "$lib/components/scroller/scroller.svelte";
  import { activePage, activeLineIndex } from "$lib/stores/store";
  import Line from "$lib/components/description-box/line.svelte";
  import { fly } from "svelte/transition";

  const props = $props();
  const lineRefs: HTMLDivElement[] = [];
  const intersectingLineIndexes: boolean[] = [];
  let intersectionObserver: IntersectionObserver;
  let initStep = $state(0);
  let initIntevalId: number;
  let inited = $state(false);

  const onInited = () => {
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
    inited = true;
  };

  onMount(() => {
    initIntevalId = setInterval(() => {
      if (initStep > $activePage.lines.length) {
        onInited();
        clearInterval(initIntevalId);
      }
      initStep++;
    }, 100);
  });

  onDestroy(() => {
    intersectionObserver?.disconnect();
    clearInterval(initIntevalId);
  });
</script>

<Scroller {...props}>
  {#each $activePage.lines.slice(0, initStep) as line, i}
    <div bind:this={lineRefs[i]} data-index={i} transition:fly={{ y: 24 }}>
      <Line
        {...line}
        text={line.text}
        isLast={inited && i === $activePage.lines.length - 1}
        isActive={i === $activeLineIndex}
        maxHeight={props.maxHeight}
      />
    </div>
  {/each}
  {#if !initStep}
    <Line text="..." />
  {/if}
</Scroller>
