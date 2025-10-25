<script lang="ts">
  const props = $props();
  const { children } = props;
</script>

<div
  class={[
    "my-4 first:mt-0 last:mb-0 italic font-[uoqmunthenkhung] text-lg text-gray-300",
    props.class,
  ]}
>
  ❝ {@render children()} ❞
</div>
