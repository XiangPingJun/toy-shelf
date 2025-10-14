<script lang="ts">
  interface Props {
    children?: any;
    onclick?: () => void;
  }

  let { children, onclick }: Props = $props();

  function handleClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    console.log("Link clicked, onclick:", typeof onclick);
    if (onclick) {
      onclick();
    } else {
      console.warn("onclick prop is not provided or is undefined");
    }
  }
</script>

<span
  class="text-blue-400 underline-offset-4 underline hover:text-blue-300 cursor-pointer font-[uoqmunthenkhung]"
  role="button"
  tabindex="0"
  onclick={handleClick}
  onkeydown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onclick) {
        onclick();
      }
    }
  }}
>
  <i class="far fa-eye underline-offset-4 underline"></i>{@render children()}
</span>
