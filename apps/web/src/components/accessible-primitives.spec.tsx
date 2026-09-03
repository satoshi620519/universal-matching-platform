import { describe, expect, it } from 'vitest';
import { Button, Card, Field, List, ListRow, StatusMessage, TextInput } from './AccessiblePrimitives';

void Button;
void Card;
void Field;
void List;
void ListRow;
void StatusMessage;
void TextInput;

describe('accessible primitive contract', () => {
  it('exports the shared primitives', () => {
    expect(typeof Button).toBe('function');
    expect(typeof Card).toBe('function');
    expect(typeof Field).toBe('function');
    expect(typeof List).toBe('function');
    expect(typeof ListRow).toBe('function');
    expect(typeof StatusMessage).toBe('function');
    expect(typeof TextInput).toBe('function');
  });
});
