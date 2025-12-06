<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.png";
	import { browser } from "$app/environment";
	import { isMobile, isPortrait } from "$lib/stores/store";
	import { onMount } from "svelte";

	const props = $props();

	onMount(() => {
		if (!browser) return;

		$isMobile = browser && window?.matchMedia("(pointer: coarse)").matches;
	});

	$effect(() => {
		if (!browser) return;

		const updateOrientation = () => {
			$isPortrait = window.innerWidth < window.innerHeight;
		};

		updateOrientation();
		window.addEventListener("resize", updateOrientation);

		return () => {
			window.removeEventListener("resize", updateOrientation);
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render props.children?.()}
