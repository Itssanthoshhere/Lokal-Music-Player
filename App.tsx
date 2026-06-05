import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { MiniPlayer } from './src/components/MiniPlayer';
import { useAudioSetup } from './src/hooks/useAudioSetup';

const AppContent: React.FC = () => {
  const insets = useSafeAreaInsets();

  // Initialize audio service and bridge to store
  useAudioSetup();

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <AppNavigator />
        <View style={{ bottom: insets.bottom }}>
          <MiniPlayer />
        </View>
      </NavigationContainer>
      <StatusBar style="light" />
    </View>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
});
