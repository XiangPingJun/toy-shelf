<script lang="ts">
  let { iconClass = null, children } = $props();
</script>

<span
  class="text-blue-400 underline-offset-4 underline hover:text-blue-300 cursor-pointer font-[uoqmunthenkhung]"
>
  {#if iconClass}
    <i class={[iconClass, "underline-offset-4 underline"]}></i>
  {/if}{@render children()}
</span>
