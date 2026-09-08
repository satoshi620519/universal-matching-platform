export type SystemHealth = Readonly<{status:'ok'|'degraded';database:'configured'|'not-configured';jobs:'configured'|'not-configured';queue:'configured'|'not-configured'}>;
export function createBrowserHealthApi(fetchImpl: typeof fetch = fetch) {
 const configured=import.meta.env.VITE_API_URL as string|undefined; const base=configured?configured.replace(/\/$/,''):'';
 return { async get():Promise<SystemHealth>{ const response=await fetchImpl(base+'/health',{credentials:'include'}); if(!response.ok) throw new Error((await response.text().catch(()=>''))||`Health request failed (${response.status})`); return response.json(); } };
}