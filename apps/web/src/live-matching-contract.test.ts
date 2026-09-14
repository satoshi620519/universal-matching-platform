import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = readFileSync(resolve(process.cwd(), 'src/live-matching.ts'), 'utf8');

describe('live matching integration contract', () => {
  it('uses the authoritative API for discovery and match decisions', () => {
    expect(source).toContain('discoverProfiles');
    expect(source).toContain('decideMatch');
    expect(source).toContain("decision: 'like'");
    expect(source).toContain("decision: 'pass'");
    expect(source).toContain('result.mutual');
  });

  it('opens messaging only from an established mutual match', () => {
    expect(source).toContain('createConversationFromMutualMatch');
    expect(source).toContain('listMessages(state.conversation.id)');
    expect(source).toContain('sendMessage(state.conversation!.id, body)');
  });

  it('refreshes persistent matches and server notifications instead of relying only on local demo state', () => {
    expect(source).toContain('listMatches()');
    expect(source).toContain('listNotifications()');
    expect(source).toContain('listMatchHistory()');
    expect(source).toContain('markNotificationRead');
  });

  it('escapes server-backed profile and message content before rendering HTML', () => {
    expect(source).toContain('const esc =');
    expect(source).toContain('esc(displayName(candidate))');
    expect(source).toContain('esc(m.body)');
    expect(source).toContain('esc(JSON.stringify(n.payload))');
  });
});
