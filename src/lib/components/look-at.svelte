<script lang="ts">
  import { splatPov, panPov, imgUrl } from "$lib/stores/store";
  const { text, setSplatPov = "", setPanPov = "", setImgUrl = "" } = $props();

  const onclick = async () => {
    $imgUrl = setImgUrl;
    $splatPov = setSplatPov;
    $panPov = setPanPov;
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
