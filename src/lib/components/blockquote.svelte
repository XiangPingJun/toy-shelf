<script lang="ts">
  let { children } = $props();
</script>

<div
  class="my-4 first:mt-0 italic font-[uoqmunthenkhung] text-lg text-gray-300"
>
  <i class="las la-quote-left"></i><!-- -->{@render children()}<i
    class="las la-quote-right"
  ></i>
</div>
