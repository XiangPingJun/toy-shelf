<script lang="ts">
  import {
    splatPov,
    panPov,
    imgUrl,
    imgBlobUrl,
    videoUrl,
    videoBlobUrl,
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
  {#if ($imgUrl && setImgUrl === $imgUrl && !$imgBlobUrl) || ($videoUrl && setVideoUrl === $videoUrl && !$videoBlobUrl)}
    <Hourglass class="underline-offset-4 underline" />
  {:else}
    <i class="las la-cube underline-offset-4 underline"></i>
  {/if}<!-- -->{text}
</button>
