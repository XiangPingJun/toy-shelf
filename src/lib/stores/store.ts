import { writable, derived } from 'svelte/store';
import type { Snippet } from 'svelte';

export const splatPov = writable('');
export const panPov = writable('');

export const resources = writable({} as Record<string, string | null>);
export const pages = writable([] as {
  type: 'splat' | 'pan',
  url: string,
  firstPov: string,
  heading: Snippet,
  content: Snippet,
}[]);

export const activeIndex = writable(0);
export const activePage = derived([pages, activeIndex], ([$pages, $activeIndex]) => {
  const p = $pages[$activeIndex];
  if (p.type === 'splat') {
    splatPov.set(p.firstPov);
  } else if (p.type === 'pan') {
    panPov.set(p.firstPov);
  }
  return p;
});

export const imgUrl = writable('');
export const videoUrl = writable('');

export const autoRotate = writable(true);
let autoRotateTimer: ReturnType<typeof setTimeout>;
autoRotate.subscribe((val) => {
  if (!val) {
    clearTimeout(autoRotateTimer);
    autoRotateTimer = setTimeout(() => {
      autoRotate.set(true);
    }, 4000);
  }
});