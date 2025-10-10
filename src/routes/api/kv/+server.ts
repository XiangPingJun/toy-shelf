import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform, url }) => {
  if (!platform?.env?.TOY_SHELF_KV) {
    return json({ error: 'KV namespace not available' }, { status: 500 });
  }

  const key = url.searchParams.get('key');
  if (!key) {
    return json({ error: 'Key parameter required' }, { status: 400 });
  }

  try {
    const value = await platform.env.TOY_SHELF_KV.get(key);
    return json({
      key,
      value: value ? JSON.parse(value) : null,
      found: !!value
    });
  } catch (error) {
    return json({ error: 'Failed to get value from KV' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ platform, request }) => {
  if (!platform?.env?.TOY_SHELF_KV) {
    return json({ error: 'KV namespace not available' }, { status: 500 });
  }

  try {
    const { key, value } = await request.json();

    if (!key) {
      return json({ error: 'Key is required' }, { status: 400 });
    }

    await platform.env.TOY_SHELF_KV.put(key, JSON.stringify(value));

    return json({
      success: true,
      key,
      message: 'Value stored successfully'
    });
  } catch (error) {
    return json({ error: 'Failed to store value in KV' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ platform, url }) => {
  if (!platform?.env?.TOY_SHELF_KV) {
    return json({ error: 'KV namespace not available' }, { status: 500 });
  }

  const key = url.searchParams.get('key');
  if (!key) {
    return json({ error: 'Key parameter required' }, { status: 400 });
  }

  try {
    await platform.env.TOY_SHELF_KV.delete(key);
    return json({
      success: true,
      key,
      message: 'Value deleted successfully'
    });
  } catch (error) {
    return json({ error: 'Failed to delete value from KV' }, { status: 500 });
  }
};