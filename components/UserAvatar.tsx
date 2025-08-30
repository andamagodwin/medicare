import React from 'react';
import { View, Text } from 'react-native';

interface UserAvatarProps {
  name: string;
  size?: number;
}

export const UserAvatar = ({ name, size = 36 }: UserAvatarProps) => {
  // Get initials from name
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0]?.toUpperCase())
        .slice(0, 2)
        .join('')
    : '';

  const fontSize = size > 50 ? 24 : size > 40 ? 18 : 16;

  return (
    <View 
      className="rounded-full bg-blue-100 items-center justify-center mr-3"
      style={{ width: size, height: size }}
    >
      <Text 
        className="text-blue-700 font-bold"
        style={{ fontSize }}
      >
        {initials}
      </Text>
    </View>
  );
};
