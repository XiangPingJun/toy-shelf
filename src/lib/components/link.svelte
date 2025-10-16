<script lang="ts">
  const { text, onclick } = $props();
</script>

<button
  class="text-blue-400 hover:text-blue-300 cursor-pointer font-[uoqmunthenkhung]"
  {onclick}
>
  <i class="far fa-eye underline-offset-4 underline"></i><span
    class="underline-offset-4 underline -mr-0.5">{" "}</span
  ><span class="underline-offset-4 underline">{text}</span>
</button>
