export type AdministrativeAccount = Readonly<{ id: string; status: string; createdAt?: string; updatedAt?: string }>;
export function createBrowserAdministrativeAccountsApi(fetchImpl: typeof fetch = fetch) {
  const configured=import.meta.env.VITE_API_URL as string|undefined; const base=configured?configured.replace(/\/$/,''):'';
  return { async findById(accountId:string):Promise<AdministrativeAccount> {
    const response=await fetchImpl(base+`/administration/accounts/${encodeURIComponent(accountId)}`,{credentials:'include'});
    if(!response.ok) throw new Error((await response.text().catch(()=>''))||`Account lookup failed (${response.status})`);
    return response.json();
  }};
}