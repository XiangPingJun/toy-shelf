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
  台北的過年，總帶著一種虛張聲勢的浪漫。
  <Link
    text="忠孝東路"
    onclick={() =>
      setPov(
        '{"enabled":true,"minDistance":2.220446049250313e-16,"maxDistance":1.7976931348623157e+308,"minZoom":0.01,"maxZoom":1.7976931348623157e+308,"minPolarAngle":0,"maxPolarAngle":3.141592653589793,"minAzimuthAngle":-1.7976931348623157e+308,"maxAzimuthAngle":1.7976931348623157e+308,"smoothTime":0.04,"draggingSmoothTime":0.125,"dollySpeed":1,"truckSpeed":2,"dollyToCursor":false,"verticalDragToForward":false,"target":[0,0,0],"position":[-1.1036037704493264,0.10761981090682979,1.3827322743115966],"zoom":0.4500000000000001,"focalOffset":[0,0,0],"target0":[0,0,0],"position0":[24.056042195026553,499.41928876495376,-1.2964734547150627],"zoom0":0.15000000000000002,"focalOffset0":[0,0,0]}',
      )}
  />
  罕見地封了街，車水馬龍變成了人聲鼎沸。
{/snippet}

<Viewer
  panUrl="/new-year-eve/panorama.jpg"
  pov={pov.val}
  heading="煙火一瞬 金光萬丈"
  {content}
  {imgUrl}
  onImgClose={() => (imgUrl = "")}
/>
