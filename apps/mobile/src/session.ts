export type CredentialStore = { get(): Promise<string | null>; set(value: string): Promise<void>; clear(): Promise<void> };

export class MobileSession {
  constructor(private readonly store: CredentialStore) {}
  getCredential(){ return this.store.get(); }
  setCredential(value:string){ return this.store.set(value); }
  clear(){ return this.store.clear(); }
}
