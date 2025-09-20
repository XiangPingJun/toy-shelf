<script lang="ts">
	import LoadingAltLoop from "../icons/LoadingAltLoop.svelte";
	let thumbnailElements = $state<HTMLDivElement[]>([]);
	let carouselContainer: HTMLDivElement | undefined;
	import { splatLoading } from "../stores/store";
	import { get } from "svelte/store";

	let {
		thumbnails = ["/01.jpg", "/02.jpg", "/03.jpg"],
		activeThumbnail = $bindable("/01.jpg"),
	} = $props();

	function setActive(thumbnail: string, i: number) {
		activeThumbnail = thumbnail;
		// Scroll the active thumbnail into view
		thumbnailElements[i].scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "start",
		});
	}
</script>

<div
	bind:this={carouselContainer}
	class="flex fixed bottom-0 w-screen overflow-x-auto justify-start select-none scrollbar-none pb-3 pt-0.5"
>
	<div class="flex gap-1 mx-2">
		{#each thumbnails as thumbnail, i}
			<div
				bind:this={thumbnailElements[i]}
				class="cursor-pointer transition-opacity duration-300 relative w-[60px] h-[80px] scroll-ml-4 bg-gray-950"
				class:opacity-80={activeThumbnail !== thumbnail}
				role="button"
				tabindex="0"
				onclick={() => setActive(thumbnail, i)}
				onkeydown={() => {}}
			>
				<img
					src={thumbnail}
					alt=""
					draggable="false"
					class:opacity-60={activeThumbnail !== thumbnail}
				/>
				{#if activeThumbnail === thumbnail}
					<div
						class="absolute top-0 w-full h-full border-2 border-gray-300"
					></div>
					{#if get(splatLoading)}
						<LoadingAltLoop class="w-[90%] h-[90%] absolute top-0 left-0" />
					{/if}
				{/if}
			</div>
		{/each}
	</div>
</div>
