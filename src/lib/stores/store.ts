import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import type { Snippet } from 'svelte';
import { get } from 'svelte/store';

const load = async (url: string) => {
  if (!browser) return '';
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return URL.createObjectURL(new Blob([buffer]));
}

export const splatPov = writable('');
export const splatUrls = writable(['']);
export const splatBlobUrl = writable('');
export const panPov = writable('');
export const panUrls = writable(['']);
export const panBlobUrl = writable('');
export const imgUrl = writable('');
export const imgBlobUrl = writable('');
imgUrl.subscribe(async (val) => {
  imgBlobUrl.set('');
  if (val) {
    imgBlobUrl.set(await load(val));
  }
});
export const videoUrl = writable('');
export const videoBlobUrl = writable('');
videoUrl.subscribe(async (val) => {
  videoBlobUrl.set('');
  if (val) {
    videoBlobUrl.set(await load(val));
  }
});
export const headings = writable([] as Snippet[]);
export const contents = writable([] as Snippet[]);
export const activeIndex = writable(0);
export const loader = derived([activeIndex, splatUrls, panUrls], async ([$activeIndex, $splatUrls, $panUrls]) => {
  splatBlobUrl.set('');
  if ($splatUrls[$activeIndex]) {
    splatBlobUrl.set(await load($splatUrls[$activeIndex]));
  }
  panBlobUrl.set('');
  if ($panUrls[$activeIndex]) {
    panBlobUrl.set(await load($panUrls[$activeIndex]));
  }
});
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