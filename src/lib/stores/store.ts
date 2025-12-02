import { writable, derived } from 'svelte/store';

export const splatPov = writable('');
export const panPov = writable('');

export const resources = writable({} as Record<string, string | null>);
export const pages = writable([] as {
  title?: string,
  type: 'splat' | 'pan',
  url: string,
  firstPov: string,
  lines: {
    text: string,
    pov: string,
    imgurl?: string,
    videourl?: string,
  }[],
}[]);

export const activePageIndex = writable(0);
export const activePage = derived([pages, activePageIndex], ([$pages, $activePageIndex]) => {
  const p = $pages[$activePageIndex];
  if (p.type === 'splat') {
    splatPov.set(p.firstPov);
  } else if (p.type === 'pan') {
    panPov.set(p.firstPov);
  }
  return p;
});

export const activeLineIndex = writable(0);
export const activeLine = derived([activePage, activeLineIndex], ([$activePage, $activeLineIndex]) => (
  $activePage.lines[$activeLineIndex]
));

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