<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Scroller from "$lib/components/scroller/scroller.svelte";
  import { activePage } from "$lib/stores/store";
  import Line from "$lib/components/description-box/line.svelte";
  import { fly } from "svelte/transition";

  const props = $props();
  const lineRefs: HTMLDivElement[] = [];
  const intersectingLineIndexes = $state<boolean[]>([]);
  let lines = $state<any[]>([]);
  let inited = $state(false);
  const firstLineIndex = $derived.by(() =>
    inited ? intersectingLineIndexes.findIndex((it) => it) : null,
  );
  let intersectionObserver: IntersectionObserver;

  onMount(async () => {
    await new Promise((r) => setTimeout(r, 50));
    lines[0] = { ...lines[0], text: "" };
    const allLines = [...$activePage.lines];
    while (allLines.length) {
      while (allLines[0].text.length) {
        lines[lines.length - 1] = {
          ...lines[lines.length - 1],
          text:
            lines[lines.length - 1].text + allLines[0].text.substring(0, 20),
        };
        allLines[0].text = allLines[0].text.substring(20);
        await new Promise((r) => setTimeout(r, 50));
      }
      lines.push(allLines.shift());
    }
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
      },
      {
        threshold: 1,
      },
    );
    lineRefs.forEach((it) => intersectionObserver.observe(it));
    inited = true;
    lines = [...lines];
  });

  onDestroy(() => {
    intersectionObserver?.disconnect();
  });
</script>

<Scroller {...props}>
  {#each lines as line, i}
    <div bind:this={lineRefs[i]} data-index={i} transition:fly={{ y: 24 }}>
      <Line
        {...line}
        text={line.text}
        isLast={inited && i === $activePage.lines.length - 1}
        isActive={inited && firstLineIndex === i}
        maxHeight={props.maxHeight}
      />
    </div>
  {/each}
  {#if !lines.length}
    <Line isLast={false} isActive={false} text="..." />
  {/if}
</Scroller>
