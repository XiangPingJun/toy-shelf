import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
  it('cn merges classes correctly', () => {
    expect(cn('w-full', 'h-full')).toBe('w-full h-full');
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });
});
