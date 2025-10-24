<script lang="ts">
  const title = "煙火一瞬 金光萬丈";
  const description =
    "2015年在東京迪士尼買下的爆米花桶，帶著八〇年代玩具的憨直與亮光";
  const ogImage = "og-image.jpg";

  import Viewer from "$lib/components/viewer.svelte";
  import LookAt from "$lib/components/look-at.svelte";
  import Blockquote from "$lib/components/blockquote.svelte";
  import { panUrl, panPov, heading, content } from "$lib/stores/store";

  $panUrl = "new-year-eve/panorama.jpg";
  $panPov =
    '{"enabled":true,"minDistance":2.220446049250313e-16,"maxDistance":1.7976931348623157e+308,"minZoom":0.01,"maxZoom":1.7976931348623157e+308,"minPolarAngle":0,"maxPolarAngle":3.141592653589793,"minAzimuthAngle":-1.7976931348623157e+308,"maxAzimuthAngle":1.7976931348623157e+308,"smoothTime":0.04,"draggingSmoothTime":0.125,"dollySpeed":1,"truckSpeed":2,"dollyToCursor":false,"target":[0,0,0],"position":[-78.15781136454892,60.394774826876066,-282.60450863078944],"zoom":1.06,"focalOffset":[0,0,0],"target0":[0,0,0],"position0":[-0.00017101007166280582,499.99999999975,-0.0004698463103928759],"zoom0":1,"focalOffset0":[0,0,0]}';
  $heading = heading1;
  $content = content1;
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

{#snippet heading1()}
  煙火一瞬 金光萬丈<i class="las la-rocket"></i>
{/snippet}

{#snippet content1()}
  台北的過年，總帶著一種虛張聲勢的浪漫。
  <LookAt
    text="忠孝東路"
    setPanPov={'{"enabled":true,"minDistance":2.220446049250313e-16,"maxDistance":1.7976931348623157e+308,"minZoom":0.01,"maxZoom":1.7976931348623157e+308,"minPolarAngle":0,"maxPolarAngle":3.141592653589793,"minAzimuthAngle":-1.7976931348623157e+308,"maxAzimuthAngle":1.7976931348623157e+308,"smoothTime":0.04,"draggingSmoothTime":0.125,"dollySpeed":1,"truckSpeed":2,"dollyToCursor":false,"verticalDragToForward":false,"target":[0,0,0],"position":[-1.1036037704493264,0.10761981090682979,1.3827322743115966],"zoom":0.4500000000000001,"focalOffset":[0,0,0],"target0":[0,0,0],"position0":[24.056042195026553,499.41928876495376,-1.2964734547150627],"zoom0":0.15000000000000002,"focalOffset0":[0,0,0]}'}
  />
  罕見地封了街，車水馬龍變成了人聲鼎沸。<br />
  大馬路兩旁的人席地而坐，有人拿著熱飲取暖，有人擠在一起自拍。四周充滿了新年的氣息。每個人都穿得整整齊齊。
  當然，
  <LookAt
    text="我們也不例外"
    setPanPov={'{"enabled":true,"minDistance":2.220446049250313e-16,"maxDistance":1.7976931348623157e+308,"minZoom":0.01,"maxZoom":1.7976931348623157e+308,"minPolarAngle":0,"maxPolarAngle":3.141592653589793,"minAzimuthAngle":-1.7976931348623157e+308,"maxAzimuthAngle":1.7976931348623157e+308,"smoothTime":0.04,"draggingSmoothTime":0.125,"dollySpeed":1,"truckSpeed":2,"dollyToCursor":false,"verticalDragToForward":false,"target":[0,0,0],"position":[2.231749593615048e-8,1.7148113644544194e-8,-2.9860510073607808e-9],"zoom":0.7100000000000003,"focalOffset":[0,0,0],"target0":[0,0,0],"position0":[24.056042195026553,499.41928876495376,-1.2964734547150627],"zoom0":0.15000000000000002,"focalOffset0":[0,0,0]}'}
    setImgUrl="new-year-eve/street.jpg"
  />
  。
  <Blockquote>在這一夜，城市把陌生人縫成同一條圍巾。</Blockquote>
  101大樓的煙火像一把巨大的
  <LookAt
    text="雞毛撢子"
    setPanPov={'{"enabled":true,"minDistance":2.220446049250313e-16,"maxDistance":1.7976931348623157e+308,"minZoom":0.01,"maxZoom":1.7976931348623157e+308,"minPolarAngle":0,"maxPolarAngle":3.141592653589793,"minAzimuthAngle":-1.7976931348623157e+308,"maxAzimuthAngle":1.7976931348623157e+308,"smoothTime":0.04,"draggingSmoothTime":0.125,"dollySpeed":1,"truckSpeed":2,"dollyToCursor":false,"verticalDragToForward":false,"target":[0,0,0],"position":[-0.000002760944043263725,-0.0000014029145679147614,-0.0000013933244172924066],"zoom":1.1100000000000005,"focalOffset":[0,0,0],"target0":[0,0,0],"position0":[24.056042195026553,499.41928876495376,-1.2964734547150627],"zoom0":0.15000000000000002,"focalOffset0":[0,0,0]}'}
    setImgUrl="new-year-eve/taipei101.jpg"
  />
  ，在夜空中胡亂揮灑。
  <LookAt
    text="qwq"
    setPanPov={'{"enabled":true,"minDistance":2.220446049250313e-16,"maxDistance":1.7976931348623157e+308,"minZoom":0.01,"maxZoom":1.7976931348623157e+308,"minPolarAngle":0,"maxPolarAngle":3.141592653589793,"minAzimuthAngle":-1.7976931348623157e+308,"maxAzimuthAngle":1.7976931348623157e+308,"smoothTime":0.04,"draggingSmoothTime":0.125,"dollySpeed":1,"truckSpeed":2,"dollyToCursor":false,"verticalDragToForward":false,"target":[0,0,0],"position":[-0.000002760944043263725,-0.0000014029145679147614,-0.0000013933244172924066],"zoom":1.1100000000000005,"focalOffset":[0,0,0],"target0":[0,0,0],"position0":[24.056042195026553,499.41928876495376,-1.2964734547150627],"zoom0":0.15000000000000002,"focalOffset0":[0,0,0]}'}
    setVideoUrl="new-year-eve/ants.mp4"
  />
{/snippet}

<Viewer />
