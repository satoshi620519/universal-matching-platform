import { describe, expect, it } from 'vitest';
import { isFeatureVisible, validateFeatureVisibilityConfiguration } from './feature-visibility-configuration.js';

describe('FeatureVisibilityConfiguration',()=>{
  const configuration={features:[{key:'matching',enabled:true},{key:'verification',enabled:false}]} as const;
  it('validates unique stable visibility keys',()=>expect(()=>validateFeatureVisibilityConfiguration(configuration)).not.toThrow());
  it('rejects duplicate keys',()=>expect(()=>validateFeatureVisibilityConfiguration({features:[...configuration.features,{key:'matching',enabled:false}]})).toThrow('unique'));
  it('controls visibility without becoming authorization',()=>{expect(isFeatureVisible(configuration,'matching')).toBe(true);expect(isFeatureVisible(configuration,'verification')).toBe(false);expect(isFeatureVisible(configuration,'unknown_future_feature')).toBe(true);});
});
