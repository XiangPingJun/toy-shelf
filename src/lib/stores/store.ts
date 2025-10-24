import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Snippet } from 'svelte';

const load = async (url: string) => {
  if (!browser) return '';
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return URL.createObjectURL(new Blob([buffer]));
}

export const splatPov = writable('');
export const splatUrl = writable('');
export const splatBlobUrl = writable('');
splatUrl.subscribe(async (val) => {
  splatBlobUrl.set('');
  if (val) {
    splatBlobUrl.set(await load(val));
  }
});
export const panPov = writable('');
export const panUrl = writable('');
export const panBlobUrl = writable('');
panUrl.subscribe(async (val) => {
  panBlobUrl.set('');
  if (val) {
    panBlobUrl.set(await load(val));
  }
});
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
export const autoRotate = writable(true);