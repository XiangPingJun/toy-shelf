<script>
  const props = $props();
  const { children, maxHeight } = props;
</script>

<div class={props.class}>
  <div
    class="scrollbar-container w-[calc(100%-0.5rem)]"
    style:max-height={maxHeight}
  >
    <div class="pl-4 pr-1 whitespace-pre-line">
      {@render children()}
    </div>
  </div>
</div>

<style>
  .scrollbar-container {
    overflow-y: auto;
  }

  .scrollbar-container::-webkit-scrollbar {
    width: 0.5rem;
  }

  .scrollbar-container::-webkit-scrollbar-track {
    background-color: #333;
    border-radius: 0.5rem;
  }

  .scrollbar-container::-webkit-scrollbar-thumb {
    background-color: #999;
    border-radius: 0.5rem;
  }
</style>
