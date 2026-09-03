import { describe, expect, it } from 'vitest';
import { EmptyState, ErrorState, LoadingState } from './LoadingEmptyStatePrimitives';

describe('loading and empty state primitives', () => {
  it('exports loading, empty, and error states', () => {
    expect(typeof LoadingState).toBe('function');
    expect(typeof EmptyState).toBe('function');
    expect(typeof ErrorState).toBe('function');
  });
});
