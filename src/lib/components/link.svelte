<script lang="ts">
  let { children } = $props();
</script>

<span
  class="text-blue-400 underline-offset-4 underline hover:text-blue-300 cursor-pointer font-[uoqmunthenkhung]"
>
  <i class="far fa-eye underline-offset-4 underline"></i>{@render children()}
</span>
