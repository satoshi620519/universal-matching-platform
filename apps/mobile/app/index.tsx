import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 24 }}><View style={{ gap: 12 }}><Text accessibilityRole="header" style={{ fontSize: 28, fontWeight: '700' }}>Universal Matching</Text><Text>Native mobile foundation ready for Phase 16 flows.</Text><Link href="/sign-in">Continue</Link></View></SafeAreaView>;
}
