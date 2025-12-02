<script lang="ts">
	import "/src/app.css";
	import favicon from "$lib/assets/favicon.png";
	import { onMount, onDestroy } from "svelte";
	import { browser } from "$app/environment";
	import { page } from "$app/state";
	import { pages, resources, imgUrl, videoUrl } from "$lib/stores/store";
	import articles from "$lib/articles/articles.js";
	import Viewer from "$lib/components/viewer.svelte";

	const article = (articles as any)[page.params.slug ?? ""] ?? {};
	const { title, description } = article;
	$pages = article.pages ?? [];

	const load = async (url: string) => {
		if (!browser) return "";
		const response = await fetch(url);
		const buffer = await response.arrayBuffer();
		return URL.createObjectURL(new Blob([buffer]));
	};

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

	onDestroy(() => {
		$pages.forEach((page) => URL.revokeObjectURL($resources[page.url] ?? ""));
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
	<title>{title}</title>
	<meta name="description" content={description} />

	<!-- Open Graph Protocol -->
	<meta property="og:title" content={`${title}(^ω^)祥平的玩具櫃`} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="og-image.jpg" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="(^ω^)祥平的玩具櫃" />

	<!-- Twitter Cards -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="og-image.jpg" />
</svelte:head>

{#if !resizing}
	<Viewer />
{/if}
