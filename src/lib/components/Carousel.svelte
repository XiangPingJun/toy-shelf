<script lang="ts">
	let active = 0; // 預設第一張圖片為啟用狀態

	const images = [
		"/01.jpg",
		"/02.jpg",
		"/03.jpg",
		"/02.jpg",
		"/01.jpg",
		"/01.jpg",
		"/01.jpg",
	];

	function setActive(index: number) {
		active = index;
	}

	function handleKeyDown(event: KeyboardEvent, index: number) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			setActive(index);
		}
	}
</script>

<div
	class="flex fixed bottom-3 w-screen overflow-x-auto px-2 justify-center select-none scrollbar-none"
>
	<div class="flex gap-2">
		{#each images as src, index}
			<div
				class="cursor-pointer transition-opacity duration-300"
				style="opacity: {active === index ? 1 : 0.3}"
				role="button"
				tabindex="0"
				on:click={() => setActive(index)}
				on:keydown={(event) => handleKeyDown(event, index)}
			>
				<img class="w-25 h-15 object-cover" {src} alt="" />
			</div>
		{/each}
	</div>
</div>
