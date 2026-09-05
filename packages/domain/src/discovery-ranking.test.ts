import { describe, expect, it } from 'vitest';
import { rankDiscoveryCandidates } from './discovery-ranking.js';
import { createGeographicScope } from './geographic-scope.js';
import { createProfile } from './profile.js';

const p=(id:string,role:string)=>createProfile({id,accountId:id,categoryId:'dating',fields:{role},geographicScope:createGeographicScope({kind:'global'})});

describe('discovery ranking', () => {
  const rules={rules:[{key:'role',targetField:'role',operator:'equals' as const,value:'designer',enabled:true}]};
  it('sorts compatibility scores deterministically with id tie-break', () => {
    const result=rankDiscoveryCandidates(p('subject','designer'),[p('b','designer'),p('a','designer'),p('c','developer')],rules,{key:'compatibilityScore',direction:'desc'});
    expect(result.map(x=>[x.profile.id,x.compatibilityScore])).toEqual([['a',100],['b',100],['c',0]]);
  });
});
