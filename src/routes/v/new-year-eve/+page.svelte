<script lang="ts">
  import Viewer from "$lib/components/viewer.svelte";
  import Link from "$lib/components/link.svelte";
  import Blockquote from "$lib/components/blockquote.svelte";

  const title = "唐老鴨爆米花 @祥平的玩具櫃";
  const description =
    "2015年在東京迪士尼買下的爆米花桶，帶著八〇年代玩具的憨直與亮光";
  const ogImage = "/duck/og-image.jpg";

  let pov = $state({ val: "[0.047,0.064,0.289,0,0,0]" });
  const setPov = (val: string) => (pov = { val });
  let imgUrl = $state("");
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />

  <!-- Open Graph Protocol -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="祥平的玩具櫃" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />
</svelte:head>

{#snippet content()}
  1
{/snippet}

<Viewer
  panUrl="/new-year-eve/panorama.jpg"
  pov={pov.val}
  heading="煙火一瞬 金光萬丈"
  {content}
  {imgUrl}
  onImgClose={() => (imgUrl = "")}
/>
