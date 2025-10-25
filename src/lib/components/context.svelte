<script lang="ts">
  import Scroller from "$lib/components/scroller.svelte";
  import { browser } from "$app/environment";
  import {
    headings,
    imgBlobUrl,
    videoBlobUrl,
    contents,
    activeIndex,
  } from "$lib/stores/store";
  import { onMount } from "svelte";

  let contentElement: HTMLDivElement | undefined = $state();
  let hiddenContentElement: HTMLDivElement | undefined = $state();
  let mounted = $state(false);
  let completed = $state(false);
  let isMobile = $state(false);

  // 打字機效果函數
  onMount(() => {
    if (!hiddenContentElement || !contentElement) return;

    mounted = true;
    const fullHTML = hiddenContentElement.innerHTML;

    // 解析 HTML 並提取純文本
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = fullHTML;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    contentElement.innerHTML = "...";

    let currentIndex = 0;

    const typeNextChar = () => {
      if (currentIndex < plainText.length) {
        // 獲取當前應該顯示的文字長度
        const targetText = plainText.slice(0, currentIndex + 1);

        // 遍歷原始HTML，構建對應長度的HTML片段
        let htmlFragment = "";
        let textCounter = 0;

        const walkNodes = (node: Node): boolean => {
          if (node.nodeType === Node.TEXT_NODE) {
            const nodeText = node.textContent || "";
            const remainingLength = targetText.length - textCounter;

            if (remainingLength <= 0) return false;

            if (nodeText.length <= remainingLength) {
              htmlFragment += nodeText;
              textCounter += nodeText.length;
              return textCounter < targetText.length;
            } else {
              htmlFragment += nodeText.slice(0, remainingLength);
              textCounter += remainingLength;
              return false;
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const elementText = element.textContent || "";
            const remainingLength = targetText.length - textCounter;

            if (remainingLength <= 0) return false;

            if (elementText.length <= remainingLength) {
              htmlFragment += element.outerHTML;
              textCounter += elementText.length;
              return textCounter < targetText.length;
            } else {
              // 部分顯示元素內容
              const clonedElement = element.cloneNode(false) as Element;
              htmlFragment += `<${clonedElement.tagName.toLowerCase()}`;

              // 複製屬性
              for (let i = 0; i < element.attributes.length; i++) {
                const attr = element.attributes[i];
                htmlFragment += ` ${attr.name}="${attr.value}"`;
              }
              htmlFragment += `>`;

              // 遞歸處理子節點
              for (const child of Array.from(element.childNodes)) {
                if (!walkNodes(child)) break;
              }

              htmlFragment += `</${clonedElement.tagName.toLowerCase()}>`;
              return false;
            }
          }
          return true;
        };

        // 重新構建HTML片段
        htmlFragment = "";
        textCounter = 0;

        for (const child of Array.from(tempDiv.childNodes)) {
          if (!walkNodes(child)) break;
        }

        if (contentElement) {
          contentElement.innerHTML = htmlFragment;
        }
        currentIndex += 20;

        setTimeout(typeNextChar, 50);
      } else {
        // 打字完成，顯示完整內容
        completed = true;
      }
    };

    typeNextChar();
  });

  // 監聽視窗大小變化
  $effect(() => {
    if (!browser) return;

    const updateOrientation = () => {
      isMobile = window.innerWidth < window.innerHeight;
    };

    updateOrientation();
    window.addEventListener("resize", updateOrientation);

    return () => {
      window.removeEventListener("resize", updateOrientation);
    };
  });
</script>

<div
  class={[
    "fixed left-1/2 -translate-x-1/2 max-w-[40rem] w-[calc(100vw-1rem)] slide",
    isMobile ? "bottom-3" : "bottom-12",
    $imgBlobUrl || $videoBlobUrl ? "pointer-events-none" : "in",
    mounted ? "" : "invisible",
  ]}
>
  <div
    class={[
      "backdrop-blur-xs absolute top-[0.2rem] w-full -z-10",
      $contents.length > 1 ? "h-[calc(100%-1rem)]" : "h-full",
    ]}
  ></div>
  <div class="flex">
    <div
      class="rounded-tl-md border-t-3 border-l-3 border-white box-content h-[1em] bg-black/50 w-[2rem]"
    ></div>
    <div class="bg-black/50 -mt-2.5 px-0.5 font-bold">
      <div class="flex items-center">
        [{@render $headings[$activeIndex]()}]
      </div>
    </div>
    <div
      class="rounded-tr-md border-t-3 border-r-3 border-white box-content h-[1em] bg-black/50 flex-grow"
    ></div>
  </div>
  <Scroller
    class="bg-black/50 border-white box-content border-l-3 border-r-3"
    maxHeight="10rem"
  >
    {#if completed}
      {@render $contents[$activeIndex]()}
    {:else}
      <div bind:this={contentElement}>
        <!-- 打字機效果會在這裡動態插入內容 -->
      </div>
    {/if}
  </Scroller>
  <div class="flex">
    <div
      class="rounded-bl-md border-b-3 border-l-3 border-white box-content h-[1em] bg-black/50 flex-grow"
    ></div>
    {#if $contents.length > 1}
      <div class="bg-black/50 pt-1.25 px-0.5 font-bold flex items-center">
        {#if $activeIndex > 0}
          [<button
            class="text-blue-400 hover:text-blue-300 cursor-pointer mx-1"
            onclick={() => $activeIndex--}>←前</button
          >]
        {/if}
        {#if $activeIndex < $contents.length - 1}
          [<button
            class="text-blue-400 hover:text-blue-300 cursor-pointer mx-1"
            onclick={() => $activeIndex++}>次→</button
          >]
        {/if}
      </div>
    {/if}
    <div
      class="rounded-br-md border-b-3 border-r-3 border-white box-content h-[1em] bg-black/50 w-[2rem]"
    ></div>
  </div>
</div>

<!-- 隱藏的原始內容用於獲取HTML -->
<div bind:this={hiddenContentElement} class="hidden">
  {@render $contents[$activeIndex]()}
</div>

<style>
  .slide {
    display: grid;
    clip-path: inset(100% 0 0 0); /* 從上方遮住內容 */
    transition: all 0.25s ease-out;
  }

  .slide.in {
    clip-path: inset(-1rem 0 0 0); /* 解除遮罩 */
  }
</style>
