<script lang="ts">
  import Viewer from "$lib/components/viewer.svelte";
  import Link from "$lib/components/link.svelte";
  import Blockquote from "$lib/components/blockquote.svelte";

  const title = "唐老鴨爆米花🗄️祥平的玩具櫃";
  const description =
    "2015年在東京迪士尼買下的爆米花桶，帶著八〇年代玩具的憨直與亮光";
  const ogImage = "/duck/og-image.jpg";

  let pov = $state([
    0.055985, 0.040282, 0.300185, 0.002496, 0.001228, -0.000562,
  ]);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />

  <!-- Open Graph Protocol -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="🗄️祥平的玩具櫃" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />
</svelte:head>

{#snippet heading()}
  唐老鴨
{/snippet}

{#snippet content()}
  2015年在東京迪士尼，我買下那只爆米花桶。<br />
  <div class="mt-2"></div>
  它像從時光機裡回來的孩子，帶著八〇年代玩具的憨直與亮光，把我拉回園區外細雨的午後與排隊時的笑聲。
  <Blockquote>我以為帶回的是爆米花，原來裝著的是那天的空氣。</Blockquote>
  藍色水手帽與飽滿的
  <Link c={() => (pov = [0.042, 0.0221, 0.3044, 0.0066, 0.0058, 0.0067])}>
    大蝴蝶結
  </Link>
  ，海軍帽上繫著樸素的
  <Link c={() => (pov = [-0.0235, 0.1212, -0.2781, 0.0153, 0.0356, 0.0067])}>
    黑色飾帶
  </Link>
  ；幾片塑膠拼出唐老鴨的輪廓，簡單卻準確。<br />
  <Blockquote>最笨拙的零件，往往把快樂固定得最牢。</Blockquote>
  背帶上的剪影像他的吐槽，直白寫著
  <Link c={() => (pov = [-0.0049, 0.2709, -0.1034, 0.0029, -0.0282, -0.0821])}>
    Disney Resort
  </Link>
  ，兩側以那
  <Link c={() => (pov = [-0.2944, 0.0098, 0.0431, 0.0029, -0.0203, 0.0175])}>
    雙黃色腳丫
  </Link>
  做扣件，把歡笑牢牢扣住。
  <div class="mt-3"></div>
  打開蓋子，裡頭只剩一個乾淨的空洞。咖哩味的爆米花早已散去，留下塑膠的清冷與指尖餘溫。它輕聲提醒我：熱鬧退場後，平凡也是一種保存，像一段未曾雕琢的日子，被妥帖收起。
{/snippet}

<Viewer splatUrl="/duck/duck.spz" {pov} {heading} {content} />
