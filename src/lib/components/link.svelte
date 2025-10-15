<script lang="ts">
  const { text, onclick } = $props();
</script>

<span
  class="text-blue-400 hover:text-blue-300 cursor-pointer font-[uoqmunthenkhung]"
  role="button"
  tabindex="0"
  {onclick}
  onkeydown={() => {}}
>
  <i class="far fa-eye underline-offset-4 underline"></i><span
    class="underline-offset-4 underline -mr-0.5">{" "}</span
  ><span class="underline-offset-4 underline">{text}</span>
</span>
