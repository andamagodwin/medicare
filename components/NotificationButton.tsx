import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface NotificationButtonProps {
  unreadCount: number;
}

export const NotificationButton = ({ unreadCount }: NotificationButtonProps) => (
  <TouchableOpacity 
    onPress={() => router.push('/notifications')}
    className="mr-4 relative"
  >
    <Ionicons name="notifications-outline" size={26} color="#2563EB" />
    {unreadCount > 0 && (
      <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
        <Text className="text-white text-xs font-bold">
          {unreadCount > 9 ? '9+' : unreadCount.toString()}
        </Text>
      </View>
    )}
  </TouchableOpacity>
);
