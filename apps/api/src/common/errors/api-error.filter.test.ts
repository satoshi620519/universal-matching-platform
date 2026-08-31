import { describe, expect, it } from 'vitest';
import { ApiErrorFilter } from './api-error.filter.js';

describe('structured API error boundary', () => {
  it('exposes a global exception filter type', () => {
    expect(new ApiErrorFilter()).toBeInstanceOf(ApiErrorFilter);
  });
});
