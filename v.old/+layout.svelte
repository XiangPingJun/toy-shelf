<script lang="ts">
	import "../../app.css";
	import favicon from "$lib/assets/favicon.png";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import { pages, resources, imgUrl, videoUrl } from "$lib/stores/store";

	let { children } = $props();
	let lastPages: typeof $pages = $pages;

	const load = async (url: string) => {
		if (!browser) return "";
		const response = await fetch(url);
		const buffer = await response.arrayBuffer();
		return URL.createObjectURL(new Blob([buffer]));
	};

	$effect(() => {
		if ($pages === lastPages || !$pages.length) {
			return;
		}
		if (!lastPages.length) {
			lastPages = $pages;
			return;
		}
		// $pages.forEach((page) => URL.revokeObjectURL($resources[page.url] ?? ""));
		lastPages = $pages;
	});

	$effect(() => {
		if (!$pages.length) {
			return;
		}
		(async () => {
			if ($resources[$pages[0].url]) {
				for (let i = 1; i < $pages.length; i++) {
					if ($resources[$pages[i].url] === undefined) {
						$resources[$pages[i].url] = null;
						$resources[$pages[i].url] = await load($pages[i].url);
					}
				}
			} else if ($resources[$pages[0].url] === undefined) {
				$resources[$pages[0].url] = null;
				$resources[$pages[0].url] = await load($pages[0].url);
			}
		})();
	});

	$effect(() => {
		if (!$imgUrl || $resources[$imgUrl] !== undefined) {
			return;
		}
		(async () => {
			$resources[$imgUrl] = null;
			$resources[$imgUrl] = await load($imgUrl);
		})();
	});

	$effect(() => {
		if (!$videoUrl || $resources[$videoUrl] !== undefined) {
			return;
		}
		(async () => {
			$resources[$videoUrl] = null;
			$resources[$videoUrl] = await load($videoUrl);
		})();
	});

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
