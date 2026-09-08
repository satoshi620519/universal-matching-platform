import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function ConversationsScreen(){const[conversationId,setConversationId]=useState('');return <SafeAreaView style={{flex:1,padding:24}}><View style={{gap:12}}><Text accessibilityRole="header" style={{fontSize:28,fontWeight:'700'}}>Conversations</Text><TextInput accessibilityLabel="Conversation ID" value={conversationId} onChangeText={setConversationId} placeholder="Conversation ID"/><Text>Messaging is available only through authorized server conversations.</Text></View></SafeAreaView>;}
