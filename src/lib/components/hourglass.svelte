<script lang="ts">
  let props = $props();
  let step = $state(0);

  setInterval(() => {
    step++;
    if (step > 2) {
      step = 0;
    }
  }, 250);
</script>

<i
  class={[`las la-hourglass-${["start", "half", "end"][step]}`, props?.class]}
  style={props?.style}
></i>
