import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native';
import { SignInScreen } from './SignInScreen.js';
import { createMobileApiClient, restoreSession, type Account, type SessionState } from './index.js';
import { createSecureCredentialStore } from './secureCredentialStore.js';

function environmentBaseUrl(): string {
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim().replace(/\/$/, '');
  if (!baseUrl) throw new Error('EXPO_PUBLIC_API_BASE_URL is required');
  return baseUrl;
}

export function MobileAppShell() {
  const credentials = useMemo(() => createSecureCredentialStore(), []);
  const client = useMemo(
    () => createMobileApiClient({ baseUrl: environmentBaseUrl() }, credentials),
    [credentials],
  );
  const [session, setSession] = useState<SessionState>({ kind: 'restoring' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    restoreSession(client, credentials)
      .then((next) => { if (mounted) setSession(next); })
      .catch(() => { if (mounted) setError('Unable to restore your session.'); });
    return () => { mounted = false; };
  }, [client, credentials]);

  function authenticated(account: Account) {
    setError(null);
    setSession({ kind: 'authenticated', account });
  }

  if (session.kind === 'restoring') {
    return <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator /><Text style={{ textAlign: 'center' }}>Restoring session…</Text></SafeAreaView>;
  }
  if (error) {
    return <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 24 }}><Text accessibilityRole="alert">{error}</Text></SafeAreaView>;
  }
  if (session.kind === 'unauthenticated') {
    return <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 24 }}><SignInScreen client={client} credentials={credentials} onAuthenticated={authenticated} /></SafeAreaView>;
  }
  return <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 24 }}><View><Text>Welcome back</Text><Text>Authenticated session active.</Text></View></SafeAreaView>;
}
