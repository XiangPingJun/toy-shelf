<script lang="ts">
  import {
    splatPov,
    panPov,
    imgUrl,
    videoUrl,
    resources,
    autoRotate,
  } from "$lib/stores/store";
  import Hourglass from "$lib/components/hourglass.svelte";

  const {
    text,
    setSplatPov = "",
    setPanPov = "",
    setImgUrl = "",
    setVideoUrl = "",
  } = $props();

  const onclick = async () => {
    $imgUrl = setImgUrl;
    $splatPov = setSplatPov;
    $panPov = setPanPov;
    $videoUrl = setVideoUrl;
    $autoRotate = false;
  };
</script>

<button
  class="text-blue-400 hover:text-blue-300 cursor-pointer font-[uoqmunthenkhung] underline-offset-4 underline"
  {onclick}
>
  {#if ($imgUrl && setImgUrl === $imgUrl && !$resources[$imgUrl]) || ($videoUrl && setVideoUrl === $videoUrl && !$resources[$videoUrl])}
    <Hourglass class="underline-offset-4 underline" />
  {:else}
    <i class="las la-mouse-pointer underline-offset-4 underline"></i>
  {/if}<!-- -->{text}
</button>
