<script lang="ts">
  const title = "唐老鴨爆米花 @祥平的玩具櫃";
  const description =
    "2015年在東京迪士尼買下的爆米花桶，帶著八〇年代玩具的憨直與亮光";
  const ogImage = "duck/og-image.jpg";

  import Viewer from "$lib/components/viewer.svelte";
  import LookAt from "$lib/components/look-at.svelte";
  import Blockquote from "$lib/components/blockquote.svelte";
  import { splatUrl, splatPov, heading } from "$lib/stores/store";

  $splatUrl = "duck/duck.spz";
  $splatPov = "[0.047, 0.064, 0.289, 0, 0, 0]";
  $heading = "唐老鴨爆米花";
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
  2015年在東京迪士尼，我買下那只爆米花桶。<br />
  <div class="mt-2"></div>
  它像從時光機裡回來的孩子，帶著八〇年代玩具的憨直與亮光，把我拉回園區外細雨的午後與排隊時的笑聲。
  <Blockquote>我以為帶回的是爆米花，原來裝著的是那天的空氣。</Blockquote>
  藍色水手帽與飽滿的
  <LookAt text="大蝴蝶結" setSplatPov="[0.04,0.044,0.299,0.006,-0.02,0.008]" />
  ，海軍帽上繫著樸素的
  <LookAt
    text="黑色飾帶"
    setSplatPov="[-0.03,0.174,-0.253,0.005,0.026,0.006]"
  />
  ；幾片塑膠拼出唐老鴨的輪廓，簡單卻準確。<br />
  我特別喜歡這個省略唐老鴨頭部的設計，簡單又能一眼認出是他。<br />
  <Blockquote>最笨拙的零件，往往把快樂固定得最牢。</Blockquote>
  背帶上的剪影直白寫著
  <LookAt
    text="Disney Resort"
    setSplatPov="[-0.01,0.198,-0.114,0.002,-0.099,-0.074]"
    setImgUrl="duck/og-image.jpg"
  />
  ，兩側以那
  <LookAt text="雙黃色腳丫" setSplatPov="[0.034,0.04,0.289,0.01,0.02,0.01]" />
  做扣件，把歡笑牢牢扣住。
  <div class="mt-3"></div>
  <LookAt
    text="打開蓋子"
    setSplatPov="[0.0215,0.2525,0.1564,0.0076,-0.001,-0.0035]"
    setImgUrl="duck/duck-open.png"
  />
  ，裡頭只剩一個乾淨的空洞。咖哩味的爆米花早已散去，留下塑膠的清冷與指尖餘溫。它輕聲提醒我：熱鬧退場後，平凡也是一種保存，像一段未曾雕琢的日子，被妥帖收起。
{/snippet}

<Viewer {content} />
