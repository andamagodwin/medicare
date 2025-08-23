import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../store/store';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoggedIn, isLoading, user } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace('/(auth)/login');
    }
  }, [isLoggedIn, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!isLoggedIn || !user) {
    return null;
  }

  return <>{children}</>;
}
