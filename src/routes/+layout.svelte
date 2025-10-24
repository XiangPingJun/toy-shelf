<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.png";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import { loader } from "$lib/stores/store";

	let { children } = $props();

	let resizing = $state(false);
	let resizeTimeout: ReturnType<typeof setTimeout>;

	onMount(() => {
		if (!browser) return;

		window?.addEventListener("resize", () => {
			resizing = true;
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				resizing = false;
			}, 750);
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if !resizing}
	{@render children?.()}
{/if}
{#await $loader}{/await}
