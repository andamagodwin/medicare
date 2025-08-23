import React from 'react';
import { View, Text } from 'react-native';

interface UserAvatarProps {
  name: string;
}

export const UserAvatar = ({ name }: UserAvatarProps) => {
  // Get initials from name
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0]?.toUpperCase())
        .slice(0, 2)
        .join('')
    : '';

  return (
    <View className="w-9 h-9 rounded-full bg-blue-100 items-center justify-center mr-3">
      <Text className="text-blue-700 font-bold text-lg">{initials}</Text>
    </View>
  );
};
