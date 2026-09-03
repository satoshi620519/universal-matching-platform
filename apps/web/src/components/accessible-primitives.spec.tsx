import { describe, expect, it } from 'vitest';
import { Button, Field, StatusMessage, TextInput } from './AccessiblePrimitives';

void Button;
void Field;
void StatusMessage;
void TextInput;

describe('accessible primitive contract', () => {
  it('exports the shared primitives', () => {
    expect(typeof Button).toBe('function');
    expect(typeof Field).toBe('function');
    expect(typeof StatusMessage).toBe('function');
    expect(typeof TextInput).toBe('function');
  });
});
