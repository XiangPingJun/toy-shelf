<script lang="ts">
  const { text, isLast, isActive } = $props();
</script>

<div
  class={[
    "mb-2 font-[uoqmunthenkhung]",
    isLast && "min-h-10rem",
    isActive && "text-gray-300",
  ]}
>
  {text}
</div>
