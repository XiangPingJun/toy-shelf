<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: oklch(20.5% 0 0);
	}
</style>
