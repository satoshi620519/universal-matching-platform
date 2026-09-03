import { describe, expect, it } from 'vitest';
import { Button, Card, Dialog, Drawer, Field, List, ListRow, StatusMessage, TextInput } from './AccessiblePrimitives';
import { BottomNavigation, HeaderNavigation } from './NavigationPrimitives';

void Button;
void Card;
void Dialog;
void Drawer;
void Field;
void List;
void ListRow;
void StatusMessage;
void TextInput;
void BottomNavigation;
void HeaderNavigation;

describe('accessible primitive contract', () => {
  it('exports the shared primitives', () => {
    expect(typeof Button).toBe('function');
    expect(typeof Card).toBe('function');
    expect(typeof Dialog).toBe('function');
    expect(typeof Drawer).toBe('function');
    expect(typeof Field).toBe('function');
    expect(typeof List).toBe('function');
    expect(typeof ListRow).toBe('function');
    expect(typeof StatusMessage).toBe('function');
    expect(typeof TextInput).toBe('function');
    expect(typeof BottomNavigation).toBe('function');
    expect(typeof HeaderNavigation).toBe('function');
  });
});
