<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Scroller from "$lib/components/scroller/scroller.svelte";
  import { activePage } from "$lib/stores/store";
  import Line from "$lib/components/description-box/line.svelte";
  import { fly } from "svelte/transition";

  const props = $props();
  const lineRefs: HTMLDivElement[] = [];
  const intersectingLineIndexes = $state<boolean[]>([]);
  let lines = $state<any[]>([{ text: "..." }]);
  let inited = $state(false);
  const firstLineIndex = $derived.by(() =>
    inited ? intersectingLineIndexes.findIndex((it) => it) : null,
  );
  let intersectionObserver: IntersectionObserver;

  onMount(async () => {
    const textCount = $activePage.lines
      .map((it) => it.text.length)
      .reduce((a, b) => a + b, 0);
    const speed = Math.ceil(textCount / 25);

    lines[0] = { text: "" };
    const allLines = JSON.parse(JSON.stringify($activePage.lines));
    while (allLines.length) {
      while (allLines[0].text.length) {
        lines[lines.length - 1] = {
          ...allLines[0],
          text:
            lines[lines.length - 1].text + allLines[0].text.substring(0, speed),
        };
        allLines[0].text = allLines[0].text.substring(speed);
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
        height={props.height}
      />
    </div>
  {/each}
  {#if !lines.length}
    <Line isLast={false} isActive={false} text="..." />
  {/if}
</Scroller>
