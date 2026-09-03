import { describe, expect, it } from 'vitest';
import { summarizeQuickLaunchConfiguration } from './quick-launch-configuration-summary.js';
describe('Quick Launch configuration summary — legal and support',()=>{
 it('projects configured public destinations',()=>{const summary=summarizeQuickLaunchConfiguration({snapshot:{legalSupport:{privacyPolicyUrl:'https://example.com/privacy',termsOfServiceUrl:'https://example.com/terms',supportUrl:'https://example.com/support',supportEmail:'support@example.com'}}});expect(summary.legalSupportCount).toBe(4);expect(summary.supportEmail).toBe('support@example.com');expect(summary.privacyPolicyUrl).toBe('https://example.com/privacy');});
 it('keeps legacy snapshots compatible',()=>{const summary=summarizeQuickLaunchConfiguration({snapshot:{}});expect(summary.legalSupportCount).toBeUndefined();expect(summary.supportUrl).toBeUndefined();});
});
