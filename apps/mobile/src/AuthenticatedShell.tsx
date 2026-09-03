import React, { useState } from 'react';
import { Button, SafeAreaView, Text, View } from 'react-native';
import type { Account } from './index.js';
import type { ProtectedDestination } from './navigation.js';

const destinations: ProtectedDestination[] = ['home','discovery','matches','conversations','profile','settings','safety'];

export function AuthenticatedShell(props: {
  account: Account;
  onSignOut(): Promise<void>;
}) {
  const [destination, setDestination] = useState<ProtectedDestination>('home');
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    try { await props.onSignOut(); } finally { setSigningOut(false); }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 24 }}>
      <Text accessibilityRole="header">Universal Matching Platform</Text>
      <Text>Signed in</Text>
      <View style={{ gap: 8, marginTop: 24 }}>
        {destinations.map((item) => (
          <Button key={item} title={item} onPress={() => setDestination(item)} />
        ))}
      </View>
      <View style={{ marginTop: 32 }}>
        <Text accessibilityRole="header">{destination}</Text>
        <Text>Feature integration is connected only after its backend contract is confirmed.</Text>
      </View>
      <View style={{ marginTop: 'auto' }}>
        <Button title={signingOut ? 'Signing out…' : 'Sign out'} disabled={signingOut} onPress={signOut} />
      </View>
    </SafeAreaView>
  );
}
