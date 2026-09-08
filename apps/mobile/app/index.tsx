import { Redirect } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMobileAuth } from '../src/auth-context';
export default function HomeScreen(){const {state}=useMobileAuth();if(state.kind==='restoring')return <SafeAreaView style={{flex:1,justifyContent:'center'}} accessibilityLabel="Restoring session"><ActivityIndicator/><Text>Restoring session…</Text></SafeAreaView>;if(state.kind==='anonymous')return <Redirect href="/sign-in"/>;if(state.kind==='error')return <SafeAreaView style={{flex:1,padding:24}}><Text accessibilityRole="alert">{state.message}</Text></SafeAreaView>;return <SafeAreaView style={{flex:1,justifyContent:'center',padding:24}}><View style={{gap:12}}><Text accessibilityRole="header" style={{fontSize:28,fontWeight:'700'}}>Universal Matching</Text><Text>Signed in as {state.account?.id}</Text></View></SafeAreaView>;}
