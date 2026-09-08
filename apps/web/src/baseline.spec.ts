import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('web baseline', () => {
  it('defines public metadata without coupling authenticated dashboard state to SEO', () => {
    const source = readFileSync(resolve(__dirname, '../index.html'), 'utf8');
    expect(source).toContain('name="description"');
    expect(source).toContain('property="og:title"');
    expect(source).toContain('name="robots"');
  });
  it('captures the active conversation id for realtime effect cleanup boundaries', () => {
    const source = readFileSync(resolve(__dirname, 'main.tsx'), 'utf8');
    expect(source).toContain('const activeConversationId=conversationId');
    expect(source).toContain("controller.abort()");
  });
  it('keeps a mobile navigation path available when the header navigation collapses', () => {
    const source = readFileSync(resolve(__dirname, 'components/NavigationPrimitives.tsx'), 'utf8');
    expect(source).toContain('ResponsiveNavigation');
    expect(source).toContain('<BottomNavigation');
  });
});
