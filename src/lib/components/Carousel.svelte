<script lang="ts">
	let active = 0;

	const thumbnails = [
		"/01.jpg",
		"/02.jpg",
		"/03.jpg",
		"/02.jpg",
		"/01.jpg",
		"/01.jpg",
		"/01.jpg",
		"/03.jpg",
		"/02.jpg",
		"/01.jpg",
		"/01.jpg",
		"/01.jpg",
		"/03.jpg",
		"/02.jpg",
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
	class="flex fixed bottom-3 w-screen overflow-x-auto justify-start select-none scrollbar-none"
>
	<div class="flex gap-2 mx-2">
		{#each thumbnails as src, index}
			<div
				class="cursor-pointer transition-opacity duration-300 border-2"
				class:border-gray-300={active === index}
				class:border-transparent={active !== index}
				style="opacity: {active === index ? 1 : 0.3}"
				role="button"
				tabindex="0"
				on:click={() => setActive(index)}
				on:keydown={(event) => handleKeyDown(event, index)}
			>
				<img class="object-cover max-w-none" {src} alt="" />
			</div>
		{/each}
	</div>
</div>
