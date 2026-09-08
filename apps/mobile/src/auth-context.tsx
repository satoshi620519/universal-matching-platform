import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { MobileApiClient } from './api-client';
import { MobileAuthService, type AuthState } from './auth-service';
import { MobileSession } from './session';
import { secureCredentialStore } from './secure-credential-store';

const AuthContext=createContext<{state:AuthState;signIn(email:string,password:string):Promise<void>;signOut():Promise<void>}|null>(null);
const baseUrl=process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
export function MobileAuthProvider({children}:{children:React.ReactNode}){
 const session=useMemo(()=>new MobileSession(secureCredentialStore),[]); const service=useMemo(()=>new MobileAuthService(new MobileApiClient({baseUrl},session),session),[session]);
 const [state,setState]=useState<AuthState>({kind:'restoring'});
 useEffect(()=>{let active=true;void service.restore().then(next=>{if(active)setState(next);}).catch(()=>{if(active)setState({kind:'error',message:'Unable to restore session'});});return()=>{active=false};},[service]);
 const value=useMemo(()=>({state,signIn:async(email:string,password:string)=>{setState({kind:'restoring'});try{setState(await service.signIn(email,password));}catch(error){setState({kind:'error',message:error instanceof Error?error.message:'Unable to sign in'});}},signOut:async()=>{await service.signOut();setState({kind:'anonymous'});}}),[state,service]);
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useMobileAuth(){const value=useContext(AuthContext);if(!value)throw new Error('MobileAuthProvider is required');return value;}
