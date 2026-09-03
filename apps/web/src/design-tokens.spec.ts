import { describe, expect, it } from 'vitest';

const tokenContract = [
  '--color-background',
  '--color-surface',
  '--color-surface-elevated',
  '--color-text-primary',
  '--color-text-secondary',
  '--color-text-muted',
  '--color-border',
  '--color-brand-primary',
  '--color-brand-secondary',
  '--color-brand-accent',
  '--color-success',
  '--color-warning',
  '--color-danger',
  '--color-focus',
  '--font-family-sans',
  '--font-family-display',
  '--font-family-mono',
  '--space-1',
  '--space-2',
  '--space-3',
  '--space-4',
  '--space-5',
  '--space-6',
  '--space-8',
  '--space-10',
  '--space-12',
  '--space-16',
  '--space-20',
  '--radius-none',
  '--radius-small',
  '--radius-medium',
  '--radius-large',
] as const;

describe('UX semantic token contract', () => {
  it('keeps the required token names stable', () => {
    expect(tokenContract).toHaveLength(32);
    expect(new Set(tokenContract).size).toBe(tokenContract.length);
    expect(tokenContract).toContain('--color-focus');
    expect(tokenContract).toContain('--radius-large');
  });
});
