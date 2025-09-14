import type { Handle } from '@sveltejs/kit';

// 簡化的 handle，移除 paraglide middleware 以避免 Node.js 依賴
export const handle: Handle = async ({ event, resolve }) => {
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', 'zh-tw')
	});
};
