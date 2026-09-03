import { describe, expect, it } from 'vitest';
import { validateProfileAgainstSchema, validateProfileSchemaConfiguration } from './profile-schema-configuration.js';

const schema={fields:[
  {key:'display_name',label:'Display name',type:'text',required:true,visibility:'public'},
  {key:'relationship_goal',label:'Goal',type:'select',visibility:'public',options:['friendship','dating']},
  {key:'internal_note',label:'Internal note',type:'text',visibility:'privileged'},
]} as const;

describe('ProfileSchemaConfiguration',()=>{
  it('validates configurable fields without changing profile ownership',()=>expect(()=>validateProfileSchemaConfiguration(schema)).not.toThrow());
  it('enforces schema values and visibility-compatible field definitions',()=>expect(()=>validateProfileAgainstSchema({display_name:'Satoshi',relationship_goal:'dating'},schema)).not.toThrow());
  it('rejects duplicate or unknown fields',()=>expect(()=>validateProfileSchemaConfiguration({fields:[...schema.fields,{...schema.fields[0]}]})).toThrow('unique'));
});
