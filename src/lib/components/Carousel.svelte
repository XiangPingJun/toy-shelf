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
			"/01.jpg",
			"/02.jpg",
			"/03.jpg",
			"/01.jpg",
			"/02.jpg",
			"/03.jpg",
		],
		activeThumbnail = $bindable("/01.jpg"),
		thumbnailOnLoad = $bindable(""),
	} = $props();

	function setActive(thumbnail: string, i: number) {
		// 只有在沒有拖動時才設置 activeThumbnail
		if (!isDragging) {
			activeThumbnail = thumbnail;

			thumbnailElements[i].scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "start",
			});
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
	class="flex fixed bottom-0 w-screen overflow-x-auto justify-start select-none scrollbar-none bg-neutral-800 pb-3 cursor-grab pt-0.5"
	style="box-shadow: var(--color-neutral-800) 0 calc(-2 * var(--spacing)) calc(2 * var(--spacing));"
	onmousedown={handleMouseDown}
	onmousemove={handleMouseMove}
	onmouseup={handleMouseUp}
	onmouseleave={handleMouseLeave}
	role="presentation"
>
	<div class="flex gap-1 mx-2">
		{#each thumbnails as thumbnail, i}
			<div
				bind:this={thumbnailElements[i]}
				class="cursor-pointer transition-opacity duration-300 border-2 relative w-[60px] h-[80px] scroll-ml-4 {(() => {
					if (thumbnailOnLoad === thumbnail) {
						return 'opacity-60';
					} else if (activeThumbnail === thumbnail) {
						return 'opacity-100';
					} else {
						return 'opacity-30';
					}
				})()}"
				class:border-gray-300={activeThumbnail === thumbnail}
				class:border-transparent={activeThumbnail !== thumbnail}
				role="button"
				tabindex="0"
				onclick={() => setActive(thumbnail, i)}
				onkeydown={() => {}}
			>
				<img src={thumbnail} alt="" draggable="false" />
				{#if thumbnailOnLoad === thumbnail}
					<LoadingAltLoop class="w-[90%] h-[90%] absolute top-0 left-0" />
				{/if}
			</div>
		{/each}
	</div>
</div>
