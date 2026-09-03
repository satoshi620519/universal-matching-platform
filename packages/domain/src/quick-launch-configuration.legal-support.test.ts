import { describe, expect, it } from 'vitest';
import { publishQuickLaunchConfiguration, validateQuickLaunchDraft } from './quick-launch-configuration.js';

const base={applicationName:'Launch',primaryColor:'#123456',supportedCountries:['JP'],categories:[{key:'dating',displayName:'Dating'}],enabledFeatures:['matching'],onboarding:[{field:'displayName',required:true}]} as const;
describe('legal and support Quick Launch metadata',()=>{
 it('publishes normalized immutable public destinations',()=>{const published=publishQuickLaunchConfiguration({...base,legalSupport:{privacyPolicyUrl:' https://example.com/privacy ',termsOfServiceUrl:'https://example.com/terms',supportEmail:' Support@Example.COM '}},1,'2026-09-03T00:00:00.000Z');expect(published.legalSupport).toEqual({privacyPolicyUrl:'https://example.com/privacy',termsOfServiceUrl:'https://example.com/terms',supportEmail:'support@example.com'});expect(Object.isFrozen(published.legalSupport)).toBe(true);});
 it('rejects unsafe or malformed destinations',()=>{expect(()=>validateQuickLaunchDraft({...base,legalSupport:{privacyPolicyUrl:'ftp://example.com'}})).toThrow('http or https');expect(()=>validateQuickLaunchDraft({...base,legalSupport:{supportEmail:'not-an-email'}})).toThrow('supportEmail');});
});
