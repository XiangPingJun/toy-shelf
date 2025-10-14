<script lang="ts">
  const { children, onclick } = $props();
</script>

<span
  class="text-blue-400 underline-offset-4 underline hover:text-blue-300 cursor-pointer font-[uoqmunthenkhung]"
  role="button"
  tabindex="0"
  {onclick}
  onkeydown={() => {}}
>
  <i class="far fa-eye underline-offset-4 underline"></i>{@render children()}
</span>
