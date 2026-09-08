import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';
export default function DiscoverScreen(){return <SafeAreaView edges={['top']} style={{flex:1,padding:24}}><View accessibilityRole="summary" style={{gap:12}}><Text accessibilityRole="header" style={{fontSize:28,fontWeight:'700'}}>Discover</Text><Text>Find relevant connections using the authoritative discovery service.</Text></View></SafeAreaView>;}
