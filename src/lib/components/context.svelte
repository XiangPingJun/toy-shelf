<script lang="ts">
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import Scroller from "$lib/components/scroller.svelte";
  const { content, onNext = null, onPrev = null } = $props();
  import { heading, imgUrl } from "$lib/stores/store";

  let visible = $state(false);
  let contentElement: HTMLDivElement | undefined = $state();
  let hiddenContentElement: HTMLDivElement | undefined = $state();
  let completed = $state(false);

  // 打字機效果函數
  async function startTypewriterEffect() {
    if (!hiddenContentElement || !contentElement) return;

    const fullHTML = hiddenContentElement.innerHTML;

    // 解析 HTML 並提取純文本
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = fullHTML;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    contentElement.innerHTML = "";

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
  }

  onMount(() => {
    visible = true;
  });

  // 當內容渲染完成後啟動打字機效果
  $effect(() => {
    if (visible && hiddenContentElement && contentElement) {
      setTimeout(startTypewriterEffect, 200);
    }
  });
</script>

{#if visible}
  <div
    class={[
      "fixed left-1/2 -translate-x-1/2 max-w-[40rem] w-[calc(100vw-1rem)]",
      window.innerWidth < window.innerHeight ? "bottom-3" : "bottom-12",
      $imgUrl ? "bounce-slide-out pointer-events-none" : "bounce-slide-in",
    ]}
    style="transition: all 0.25s ease-out;"
    transition:slide
  >
    <div
      class="backdrop-blur-xs max-w-[40rem] w-[calc(100vw-1rem)] h-[12rem] top-[0.2rem] absolute bottom-0 -z-10"
    ></div>
    <div class="flex">
      <div
        class="rounded-tl-md border-t-3 border-l-3 border-white box-content h-[1em] bg-black/50 w-[2rem]"
      ></div>
      <div class="bg-black/50 -mt-2.5 px-0.5 font-bold">
        [<span class="mx-1">{$heading}</span>]
      </div>
      <div
        class="rounded-tr-md border-t-3 border-r-3 border-white box-content h-[1em] bg-black/50 flex-grow"
      ></div>
    </div>
    <Scroller
      class="h-[10rem] bg-black/50 border-white box-content border-l-3 border-r-3"
      maxHeight="10rem"
    >
      {#if completed}
        {@render content()}
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
      {#if onNext || onPrev}
        <div class="bg-black/50 pt-1.25 px-0.5 font-bold flex items-center">
          {#if onPrev}
            [<button
              class="text-blue-400 hover:text-blue-300 cursor-pointer mx-1"
              onclick={onPrev}>←前</button
            >]
          {/if}
          {#if onNext}
            [<button
              class="text-blue-400 hover:text-blue-300 cursor-pointer mx-1"
              onclick={onNext}>次→</button
            >]
          {/if}
        </div>
      {/if}
      <div
        class="rounded-br-md border-b-3 border-r-3 border-white box-content h-[1em] bg-black/50 w-[2rem]"
      ></div>
    </div>
  </div>
{/if}

<!-- 隱藏的原始內容用於獲取HTML -->
<div bind:this={hiddenContentElement} class="hidden">
  {@render content()}
</div>

<style>
  .bounce-slide-in {
    animation: bounceSlideIn 0.6s ease-out forwards;
  }

  .bounce-slide-out {
    animation: bounceSlideOut 0.4s ease-in forwards;
  }

  @keyframes bounceSlideIn {
    0% {
      transform: translateY(-100%) scale(0.3);
      opacity: 0;
    }
    50% {
      transform: translateY(10%) scale(1.05);
    }
    70% {
      transform: translateY(-5%) scale(0.98);
    }
    100% {
      transform: translateY(0%) scale(1);
      opacity: 1;
    }
  }

  @keyframes bounceSlideOut {
    0% {
      transform: translateY(0%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateY(100%) scale(0.3);
      opacity: 0;
    }
  }
</style>
