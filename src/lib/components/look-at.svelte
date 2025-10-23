<script lang="ts">
  import { splatPov, panPov, imgUrl, videoUrl } from "$lib/stores/store";
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
  };
</script>

<button
  class="text-blue-400 hover:text-blue-300 cursor-pointer font-[uoqmunthenkhung]"
  {onclick}
>
  <i class="far fa-eye underline-offset-4 underline"></i><span
    class="underline-offset-4 underline -mr-0.5">{" "}</span
  ><span class="underline-offset-4 underline">{text}</span>
</button>
