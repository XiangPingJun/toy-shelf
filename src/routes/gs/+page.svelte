<script lang="ts">
  import { onMount } from "svelte";
  import SplatViewer from "$lib/components/SplatViewer.svelte";
  import Carousel from "$lib/components/Carousel.svelte";

  let splatURL = "/ggun.zip";

  onMount(() => {
    console.log("Page: Initial splatURL:", splatURL);
    // 5秒後切換到 just.zip
    setTimeout(() => {
      console.log("Page: Changing splatURL from", splatURL, "to /just.zip");
      splatURL = "/just.zip";
      console.log("Page: splatURL is now:", splatURL);
    }, 5000);
  });
</script>

<SplatViewer {splatURL} />
<Carousel />
