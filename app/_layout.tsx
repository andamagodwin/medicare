import '../global.css';

import { Stack } from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen 
        name="search" 
        options={{ 
          headerShown: true,
          presentation: 'card'
        }} 
      />
      <Stack.Screen 
        name="doctors" 
        options={{ 
          headerShown: true,
          presentation: 'card'
        }} 
      />
      <Stack.Screen 
        name="doctor/[doctorId]" 
        options={{ 
          headerShown: true,
          presentation: 'card'
        }} 
      />
      <Stack.Screen 
        name="specialty/[specialty]" 
        options={{ 
          headerShown: true,
          presentation: 'card'
        }} 
      />
    </Stack>
  );
}
