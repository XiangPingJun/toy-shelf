<script lang="ts">
	let active = 0;
	let thumbnailElements: HTMLDivElement[] = [];
	let carouselContainer: HTMLDivElement | undefined;
	let isDragging = false;
	let startX = 0;
	let scrollLeft = 0;

	export let thumbnails: string[] = [
		"/01.jpg",
		"/02.jpg",
		"/03.jpg",
		"/01.jpg",
		"/02.jpg",
		"/03.jpg",
	];

	function setActive(index: number) {
		// 只有在沒有拖動時才設置 active
		if (!isDragging) {
			active = index;

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

	function handleKeyDown(event: KeyboardEvent, index: number) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			setActive(index);
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
	on:mousedown={handleMouseDown}
	on:mousemove={handleMouseMove}
	on:mouseup={handleMouseUp}
	on:mouseleave={handleMouseLeave}
	role="presentation"
>
	<div class="flex gap-2 mx-2">
		{#each thumbnails as src, index}
			<div
				bind:this={thumbnailElements[index]}
				class="cursor-pointer transition-opacity duration-300 border-2"
				class:border-gray-300={active === index}
				class:border-transparent={active !== index}
				style="opacity: {active === index ? 1 : 0.3}"
				role="button"
				tabindex="0"
				on:click={() => setActive(index)}
				on:keydown={(event) => handleKeyDown(event, index)}
			>
				<img class="object-cover max-w-none" {src} draggable="false" alt="" />
			</div>
		{/each}
	</div>
</div>
