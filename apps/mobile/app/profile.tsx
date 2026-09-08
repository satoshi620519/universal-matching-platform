import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Button, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MobileApiClient } from '../src/api-client';
import {
  MobileProfileService,
  type MobileCategory,
  type MobileProfile,
  type MobileProfileFieldValue,
} from '../src/profile-service';
import { MobileSession } from '../src/session';
import { secureCredentialStore } from '../src/secure-credential-store';

const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

export default function ProfileScreen() {
  const service = useMemo(
    () =>
      new MobileProfileService(
        new MobileApiClient({ baseUrl }, new MobileSession(secureCredentialStore)),
      ),
    [],
  );
  const [profile, setProfile] = useState<MobileProfile | null>(null);
  const [categories, setCategories] = useState<MobileCategory[]>([]);
  const [biography, setBiography] = useState('');
  const [fields, setFields] = useState<Record<string, MobileProfileFieldValue>>({});
  const [state, setState] = useState<'loading' | 'ready' | 'saving' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const load = () => {
    setState('loading');
    setMessage('');
    Promise.all([service.getMine(), service.listCategories()])
      .then(([p, c]) => {
        setProfile(p);
        setCategories(c.categories);
        setBiography(p.biography ?? '');
        setFields(p.fields ?? {});
        setState('ready');
      })
      .catch(() => {
        setState('error');
        setMessage('Unable to load profile');
      });
  };

  useEffect(() => {
    load();
  }, [service]);

  if (state === 'loading') {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator accessibilityLabel="Loading profile" />
      </SafeAreaView>
    );
  }

  if (state === 'error') {
    return (
      <SafeAreaView style={{ flex: 1, padding: 24, gap: 12 }}>
        <Text accessibilityRole="alert">{message}</Text>
        <Button title="Retry" onPress={load} />
      </SafeAreaView>
    );
  }

  const category = categories.find((c) => c.id === profile?.categoryId);

  const renderField = ([key, rule]: [
    string,
    MobileCategory['fieldSchema'][string],
  ]) => {
    if (rule.kind === 'boolean') {
      return (
        <View key={key}>
          <Text>{key}</Text>
          <Switch
            accessibilityLabel={key}
            value={Boolean(fields[key])}
            onValueChange={(value) =>
              setFields((current) => ({ ...current, [key]: value }))
            }
            disabled={state === 'saving'}
          />
        </View>
      );
    }

    return (
      <TextInput
        key={key}
        accessibilityLabel={key}
        keyboardType={rule.kind === 'number' ? 'numeric' : 'default'}
        value={
          fields[key] === null || fields[key] === undefined ? '' : String(fields[key])
        }
        onChangeText={(value) =>
          setFields((current) => ({
            ...current,
            [key]: rule.kind === 'number' && value !== '' ? Number(value) : value,
          }))
        }
        editable={state !== 'saving'}
      />
    );
  };

  const save = () => {
    setState('saving');
    service
      .updateMine({ biography, fields })
      .then((p) => {
        setProfile(p);
        setFields(p.fields ?? {});
        setState('ready');
      })
      .catch(() => {
        setState('error');
        setMessage('Unable to save profile');
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 24 }}>
      <View style={{ gap: 12 }}>
        <Text accessibilityRole="header" style={{ fontSize: 28, fontWeight: '700' }}>
          Profile
        </Text>
        <Text>Category: {profile?.categoryId}</Text>
        <TextInput
          accessibilityLabel="Biography"
          multiline
          value={biography}
          onChangeText={setBiography}
          editable={state !== 'saving'}
        />
        {Object.entries(category?.fieldSchema ?? {}).map(renderField)}
        {state === 'saving' ? (
          <ActivityIndicator accessibilityLabel="Saving profile" />
        ) : (
          <Button title="Save profile" onPress={save} />
        )}
      </View>
    </SafeAreaView>
  );
}
