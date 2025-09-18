<script lang="ts">
	import LoadingAltLoop from "../icons/LoadingAltLoop.svelte";
	let thumbnailElements = $state<HTMLDivElement[]>([]);
	let carouselContainer: HTMLDivElement | undefined;
	let isDragging = false;
	let startX = 0;
	let scrollLeft = 0;

	let {
		thumbnails = [
			"/01.jpg",
			"/02.jpg",
			"/03.jpg",
			"/01.jpg",
			"/02.jpg",
			"/03.jpg",
			"/01.jpg",
			"/02.jpg",
			"/03.jpg",
			"/01.jpg",
			"/02.jpg",
			"/03.jpg",
		],
		activeThumbnailIndex = $bindable(0),
		thumbnailOnLoadIndex = $bindable<number | undefined>(0),
	} = $props();

	function setActive(index: number) {
		// 只有在沒有拖動時才設置 activeThumbnailIndex
		if (!isDragging) {
			activeThumbnailIndex = index;

			// 捲動到選中的圖片，使其在畫面中央
			if (thumbnailElements[index]) {
				thumbnailElements[index].scrollIntoView({
					behavior: "smooth",
					block: "nearest",
					inline: "center",
				});
			}
		}
	}

	function handleMouseDown(e: MouseEvent) {
		if (!carouselContainer) return;
		isDragging = true;
		startX = e.pageX - carouselContainer.offsetLeft;
		scrollLeft = carouselContainer.scrollLeft;
		carouselContainer.style.cursor = "grabbing";
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging || !carouselContainer) return;
		e.preventDefault();
		const x = e.pageX - carouselContainer.offsetLeft;
		const walk = (x - startX) * 2; // 調整拖動靈敏度
		carouselContainer.scrollLeft = scrollLeft - walk;
	}

	function handleMouseUp() {
		isDragging = false;
		if (carouselContainer) {
			carouselContainer.style.cursor = "grab";
		}
	}

	function handleMouseLeave() {
		isDragging = false;
		if (carouselContainer) {
			carouselContainer.style.cursor = "grab";
		}
	}
</script>

<div
	bind:this={carouselContainer}
	class="flex fixed bottom-3 w-screen overflow-x-auto justify-start select-none scrollbar-none"
	style="cursor: grab;"
	onmousedown={handleMouseDown}
	onmousemove={handleMouseMove}
	onmouseup={handleMouseUp}
	onmouseleave={handleMouseLeave}
	role="presentation"
>
	<div class="flex gap-2 mx-2 pb-0.5">
		{#each thumbnails as src, i}
			<div
				bind:this={thumbnailElements[i]}
				class="cursor-pointer transition-opacity duration-300 border-2 relative {(() => {
					if (thumbnailOnLoadIndex === i) {
						return 'opacity-60';
					} else if (activeThumbnailIndex === i) {
						return 'opacity-100';
					} else {
						return 'opacity-30';
					}
				})()}"
				class:border-gray-300={activeThumbnailIndex === i}
				class:border-transparent={activeThumbnailIndex !== i}
				role="button"
				tabindex="0"
				onclick={() => setActive(i)}
				onkeydown={() => {}}
				style:width="100px"
				style:height="60px"
			>
				<img {src} alt="" draggable="false" />
				{#if thumbnailOnLoadIndex === i}
					<LoadingAltLoop class="w-full h-full absolute top-0 left-0" />
				{/if}
			</div>
		{/each}
	</div>
</div>
