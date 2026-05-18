import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import WelcomeScreen from './src/screens/WelcomeScreen';
import PhoneModelScreen from './src/screens/PhoneModelScreen';
import PlayerSetupScreen from './src/screens/PlayerSetupScreen';
import PhotoCaptureScreen from './src/screens/PhotoCaptureScreen';
import StickerPreviewScreen from './src/screens/StickerPreviewScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#0A1628' },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="PhoneModel" component={PhoneModelScreen} />
        <Stack.Screen name="PlayerSetup" component={PlayerSetupScreen} />
        <Stack.Screen name="PhotoCapture" component={PhotoCaptureScreen} />
        <Stack.Screen name="StickerPreview" component={StickerPreviewScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
