import { describe, expect, it } from 'vitest';
import { defaultBrandingThemeConfiguration, validateBrandingThemeConfiguration } from './branding-theme-configuration.js';

describe('BrandingThemeConfiguration', () => {
  it('derives a backwards-compatible Quick Launch default', () => {
    expect(defaultBrandingThemeConfiguration({ logoUrl: 'https://example.test/logo.svg', primaryColor: '#123456' })).toMatchObject({ logoUrl: 'https://example.test/logo.svg', primaryColor: '#123456' });
  });
  it('rejects invalid theme values', () => {
    expect(() => validateBrandingThemeConfiguration({ primaryColor: 'blue' })).toThrow('primaryColor');
    expect(() => validateBrandingThemeConfiguration({ primaryColor: '#123456', typography: { fontFamily: ' ' } })).toThrow('fontFamily');
  });
});
