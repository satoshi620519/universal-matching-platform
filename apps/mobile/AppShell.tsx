import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native';
import { createMobileApiClient, restoreSession, type SessionState } from './src/index.js';
import { createSecureCredentialStore } from './src/secureCredentialStore.js';

export default function App() {
  const credentials = useMemo(() => createSecureCredentialStore(), []);
  const client = useMemo(() => createMobileApiClient({ baseUrl: (process.env.EXPO_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '') }, credentials), [credentials]);
  const [session, setSession] = useState<SessionState>({ kind: 'restoring' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    restoreSession(client, credentials)
      .then((next) => { if (active) setSession(next); })
      .catch(() => { if (active) setError('Unable to restore your session.'); });
    return () => { active = false; };
  }, [client, credentials]);

  if (session.kind === 'restoring') return <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator /><Text style={{ textAlign: 'center' }}>Restoring session…</Text></SafeAreaView>;
  if (error) return <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 24 }}><Text>{error}</Text></SafeAreaView>;
  if (session.kind === 'unauthenticated') return <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 24 }}><Text>Welcome</Text><Text>Sign in to continue.</Text></SafeAreaView>;
  return <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 24 }}><View><Text>Welcome back</Text><Text>Authenticated session active.</Text></View></SafeAreaView>;
}
