<script lang="ts">
  import description from "./description";
  const title = "迪士尼爆米花";
  const ogImage = "og-image.jpg";

  import Viewer from "$lib/components/viewer.svelte";
  import LookAt from "$lib/components/look-at.svelte";
  import Blockquote from "$lib/components/blockquote.svelte";
  import { pages } from "$lib/stores/store";

  $pages = [
    {
      type: "splat",
      url: "donald-pop.spz",
      firstPov: "[0.047, 0.064, 0.289, 0, 0, 0]",
      heading: heading1,
      content: content1,
    },
    {
      type: "splat",
      url: "alice.spz",
      firstPov: "[-0.2961,0.9998,1.4685,0.051,0.4926,-0.1336]",
      heading: heading2,
      content: content2,
    },
    {
      type: "splat",
      url: "duffy.spz",
      firstPov: "[0.5462,0.0634,-0.0502,-0.0596,-0.0067,0.0077]",
      heading: heading3,
      content: content3,
    },
  ];
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />

  <!-- Open Graph Protocol -->
  <meta property="og:title" content={`${title}(^ω^)祥平的玩具櫃`} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="(^ω^)祥平的玩具櫃" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />
</svelte:head>

{#snippet heading1()}
  老唐爆米花<i class="las la-feather-alt"></i>
{/snippet}

{#snippet heading2()}
  愛麗絲夢遊仙境<i class="las la-heart"></i>
{/snippet}

{#snippet heading3()}
  達菲與他的快樂夥伴們<i class="las la-heart"></i>
{/snippet}

{#snippet content1()}
  2015年在東京迪士尼，我買下那只爆米花桶。
  <div class="mt-3"></div>
  它像從時光機裡回來的孩子，帶著八〇年代玩具的憨直與亮光，把我拉回園區外細雨的午後與排隊時的笑聲。
  <Blockquote>我以為帶回的是爆米花，原來裝著的是那天的空氣。</Blockquote>
  藍色水手帽與飽滿的<LookAt
    text="大蝴蝶結"
    setSplatPov="[0.04,0.044,0.299,0.006,-0.02,0.008]"
  />，海軍帽上繫著樸素的<LookAt
    text="黑色飾帶"
    setSplatPov="[-0.03,0.174,-0.253,0.005,0.026,0.006]"
  />；幾片塑膠拼出唐老鴨的輪廓，簡單卻準確。<br />
  我特別喜歡這個省略唐老鴨頭部的設計，簡單又能一眼認出『是他！』
  <div class="mt-3"></div>
  背帶上的剪影直白寫著<LookAt
    text="Disney Resort"
    setSplatPov="[-0.01,0.198,-0.114,0.002,-0.099,-0.074]"
    setImgUrl="og-image.jpg"
  />，兩側以那雙<LookAt
    text="黃色腳丫"
    setSplatPov="[0.3222,0.0552,-0.0702,0.0408,-0.0009,0.0175]"
  />做扣件，把歡笑牢牢扣住。
  <div class="mt-3"></div>
  <LookAt
    text="打開蓋子"
    setSplatPov="[0.0215,0.2525,0.1564,0.0076,-0.001,-0.0035]"
    setImgUrl="donald-pop-open.png"
  />，裡頭只剩一個乾淨的空洞。咖哩味的爆米花早已散去，留下塑膠的清冷與指尖餘溫。它輕聲提醒我：熱鬧退場後，平凡也是一種保存，像一段未曾雕琢的日子，被妥帖收起。
{/snippet}

{#snippet content2()}
  時光荏苒，轉眼已是疫情後的2023年。再次踏入樂園，爆米花桶的設計像是進入了一個嶄新的次元。園區內甚至出現了專賣店，琳瑯滿目的設計讓人目不暇給。
  <Blockquote>愛麗絲夢遊仙境主題的爆米花桶尤其令我人著迷。</Blockquote>
  <LookAt
    text="人物部分"
    setSplatPov="[0.0271,0.6802,0.9729,0.305,0.5352,-0.1164]"
  />做工不錯，有傳達出那種天真爛漫的形象。<br />
  ．咧著嘴笑的<LookAt
    text="妙妙貓"
    setSplatPov="[-0.25,0.6177,1.1465,0.0473,0.61,-0.1417]"
  />，精緻的花朵，充滿了奇幻色彩。<br />
  ．撲克牌形狀的<LookAt
    text="餅乾"
    setSplatPov="[0.3272,0.1155,1.1548,0.167,0.1617,-0.1567]"
  />，看起來倒像是挺好吃。<br />
  ．背後的<LookAt
    text="白兔先生"
    setSplatPov="[0.2296,0.6649,-1.4858,-0.0739,0.5906,-0.1297]"
  />，則像是在提醒：時間不多了，趕緊帶著這份夢幻起行。<br />
  <div class="mt-3"></div>
  更令人驚喜的是，桶蓋竟然是雙層設計！<br />
  ．第一層是一面貼心的<LookAt
    text="化妝鏡"
    setSplatPov="[0.05,2.192,-0.1311,0.05,0.4834,-0.1311]"
    setImgUrl="alice1.png"
  />。<br />
  ．第二層才是<LookAt
    text="盛裝爆米花的地方"
    setSplatPov="[-0.2244,1.6938,1.0351,0.0012,0.5157,-0.1633]"
    setImgUrl="alice2.png"
  />的地方。<br />
  這份細膩與巧思，讓人不禁讚嘆。
{/snippet}

{#snippet content3()}
  達菲熊，我想這是許多人進迪士尼海洋購物的首要標的。疫情之後一直是中國黃牛的優先目標。<br
  />
  這是一個容量最大的<LookAt
    text="爆米花桶"
    setSplatPov="[0.4517,0.3808,-0.072,-0.0213,-0.0129,0.008]"
    setImgUrl="duffy-open.png"
  />，足以裝滿一整天的歡樂，特別適合與朋友一同分享。<br />
  <div class="mt-3"></div>
  夜晚時，它能夠<LookAt
    text="發光"
    setSplatPov="[0.3825,0.1742,0.3731,-0.0504,-0.0057,0.0065]"
    setImgUrl="duffy-light.jpg"
  />，吊在脖間，彷彿一盞指引方向的燈籠。
  <div class="mt-3"></div>
  內建的<LookAt
    text="LED燈"
    setSplatPov="[-0.6344,0.1089,0.0034,-0.0504,-0.0057,0.0065]"
    setImgUrl="duffy-seperate.png"
  />，可以拆卸清洗，既方便又實用。
  <div class="mt-3"></div>
  桶身上的設計也毫不馬虎，不僅僅是封面的<LookAt
    text="達菲🐻"
    setSplatPov="[0.324,-0.0945,0.0339,-0.0504,-0.0959,0.0129]"
  />、窗邊的<LookAt
    text="史黛拉🐰"
    setSplatPov="[0.4063,0.093,0.0842,-0.05,0.0364,0.1093]"
  />、屋頂上的<LookAt
    text="傑拉托尼🐱"
    setSplatPov="[0.174,0.2686,-0.2823,-0.0554,0.1923,-0.1047]"
  />、兩側的<LookAt
    text="奧樂米拉🐢"
    setSplatPov="[0.0086,0.1271,-0.4601,0.0075,0.0005,0.0078]"
  />、以及<LookAt
    text="可琦安🐶"
    setSplatPov="[0.0033,-0.0757,0.4641,-0.0458,-0.0774,0.0063]"
  />...<br />
  ...<br />
  <div class="text-xl">雪莉玫🎀上哪去了？</div>
  <div class="mt-3"></div>
  <LookAt
    text="後面"
    setSplatPov="[-0.6344,0.1089,0.0034,-0.0504,-0.0057,0.0065]"
  />還有空間啊，怎麼不安一個？肯定是被園方忘了，真可憐啊...
{/snippet}

<Viewer />
