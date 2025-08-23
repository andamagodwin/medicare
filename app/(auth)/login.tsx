import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuthStore } from '../../store/store';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, clearSessions } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      // Handle session conflict error
      if (error.message?.includes('session is active') || error.message?.includes('already logged in')) {
        Alert.alert(
          'Session Conflict', 
          'There seems to be an active session. Would you like to clear it and try again?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Clear & Retry', 
              onPress: async () => {
                try {
                  await clearSessions();
                  await login(email, password);
                  router.replace('/(tabs)');
                } catch (retryError: any) {
                  Alert.alert('Login Failed', retryError.message || 'An error occurred during login');
                }
              }
            },
          ]
        );
      } else {
        Alert.alert('Login Failed', error.message || 'An error occurred during login');
      }
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-gray-600">Signing you in...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-20">
        {/* Header */}
        <View className="mb-12">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</Text>
          <Text className="text-lg text-gray-600">Sign in to your Medicare account</Text>
        </View>

        {/* Login Form */}
        <View className="space-y-6">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <TouchableOpacity
            className="bg-blue-600 py-4 rounded-lg items-center mt-6"
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text className="text-white font-semibold text-lg">Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="mt-8 items-center">
          <Text className="text-gray-600">Don&apos;t have an account?</Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity className="mt-2">
              <Text className="text-blue-600 font-semibold">Create Account</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
