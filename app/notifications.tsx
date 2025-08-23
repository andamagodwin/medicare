import React from 'react';
import { View, Text } from 'react-native';

export default function NotificationsScreen() {
  // You can fetch and display notifications here
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg font-semibold">Notifications</Text>
      <Text className="text-gray-500 mt-2">No notifications yet.</Text>
    </View>
  );
}
