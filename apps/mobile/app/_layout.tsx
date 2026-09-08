import { Tabs } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return <SafeAreaProvider><Tabs screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}>
    <Tabs.Screen name="index" options={{ title: 'Home' }} />
    <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
    <Tabs.Screen name="conversations" options={{ title: 'Conversations' }} />
    <Tabs.Screen name="activity" options={{ title: 'Activity' }} />
    <Tabs.Screen name="sign-in" options={{ href: null }} />
  </Tabs></SafeAreaProvider>;
}
