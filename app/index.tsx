import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../store/store';

export default function Index() {
  const { isLoggedIn, user, hasHydrated, checkAuthState } = useAuthStore();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Only proceed after store has hydrated and we're not already navigating
    if (!hasHydrated || isNavigating) return;

    const handleNavigation = async () => {
      setIsNavigating(true);
      
      try {
        // If user appears to be logged in from storage, verify with server
        if (isLoggedIn && user) {
          await checkAuthState(false);
          // Get fresh state after verification
          const currentState = useAuthStore.getState();
          if (currentState.isLoggedIn && currentState.user) {
            router.replace('/(tabs)');
          } else {
            router.replace('/(auth)/login');
          }
        } else {
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('Navigation error:', error);
        router.replace('/(auth)/login');
      }
    };

    // Add a small delay to ensure the navigation system is ready
    const timer = setTimeout(handleNavigation, 100);
    
    return () => clearTimeout(timer);
  }, [hasHydrated, isLoggedIn, user, isNavigating, checkAuthState]);

  // Show loading screen
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#2563eb" />
      <Text className="mt-4 text-gray-600">Loading...</Text>
    </View>
  );
}
