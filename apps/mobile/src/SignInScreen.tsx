import React, { useState } from 'react';
import { ActivityIndicator, Button, Text, TextInput, View } from 'react-native';
import { signIn } from './auth.js';
import type { Account, CredentialStore, MobileApiClient } from './index.js';

export function SignInScreen(props: {
  client: MobileApiClient;
  credentials: CredentialStore;
  onAuthenticated(account: Account): void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const account = await signIn(props.client, props.credentials, email.trim(), password);
      props.onAuthenticated(account);
    } catch {
      setError('Sign in failed. Check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={{ gap: 12 }}>
      <Text>Sign in</Text>
      <TextInput accessibilityLabel="Email" autoCapitalize="none" autoComplete="email" keyboardType="email-address" value={email} onChangeText={setEmail} placeholder="Email" />
      <TextInput accessibilityLabel="Password" autoComplete="password" secureTextEntry value={password} onChangeText={setPassword} placeholder="Password" />
      {error ? <Text accessibilityRole="alert">{error}</Text> : null}
      {submitting ? <ActivityIndicator /> : <Button title="Sign in" onPress={submit} />}
    </View>
  );
}
