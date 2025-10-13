<script lang="ts">
  import SplatContainer from "$lib/components/splat-container.svelte";
  import Context from "$lib/components/context.svelte";
  import Link from "$lib/components/link.svelte";
</script>

{#snippet content()}
  2015年在東京迪士尼，我買下那只爆米花桶。
  它像從時光機裡回來的孩子，帶著八〇年代玩具的憨直與亮光，把我拉回園區外細雨的午後與排隊時的笑聲。
  <blockquote class="m-1">
    我以為帶回的是爆米花，原來裝著的是那天的空氣。
  </blockquote>
  藍色水手帽與飽滿的
  <Link iconClass="las la-ribbon">大蝴蝶結</Link>
  ，海軍帽上繫著樸素的黑色飾帶；幾片塑膠拼出唐老鴨的輪廓，簡單卻準確。背帶上的剪影像他的吐槽，直白寫著
  Disney Resort，兩側以那雙黃色腳丫做扣件，把歡笑牢牢扣住。
  <blockquote>最笨拙的零件，往往把快樂固定得最牢。f</blockquote>
  打開蓋子，裡頭只剩一個乾淨的空洞。咖哩味的爆米花早已散去，留下塑膠的清冷與指尖餘溫。它輕聲提醒我：熱鬧退場後，平凡也是一種保存，像一段未曾雕琢的日子，被妥帖收起。
  <blockquote>空無並非缺席，它是回憶的形狀。</blockquote>
{/snippet}

<SplatContainer url="/duck/duck.spz" />
<Context {content} />
