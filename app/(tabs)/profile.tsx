import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/store';
import { UserAvatar } from '../../components/UserAvatar';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: () => {
        // TODO: Navigate to edit profile screen
        console.log('Edit Profile');
      },
    },
    {
      icon: 'medical-outline',
      title: user?.userType === 'doctor' ? 'Medical License' : 'Medical History',
      subtitle: user?.userType === 'doctor' ? 'View your credentials' : 'View your medical records',
      onPress: () => {
        // TODO: Navigate to medical info screen
        console.log('Medical Info');
      },
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      onPress: () => {
        // TODO: Navigate to notifications settings
        console.log('Notifications');
      },
    },
    {
      icon: 'card-outline',
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
      onPress: () => {
        // TODO: Navigate to payment methods
        console.log('Payment Methods');
      },
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => {
        // TODO: Navigate to help screen
        console.log('Help & Support');
      },
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      subtitle: 'App preferences and privacy',
      onPress: () => {
        // TODO: Navigate to settings screen
        console.log('Settings');
      },
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm border border-gray-100">
          <View className="items-center">
            <UserAvatar name={user?.name || 'User'} size={80} />
            <Text className="text-xl font-bold text-gray-900 mt-4">
              {user?.name || 'User'}
            </Text>
            <Text className="text-gray-500 capitalize">
              {user?.userType || 'Patient'}
            </Text>
            {user?.email && (
              <Text className="text-gray-500 mt-1">
                {user.email}
              </Text>
            )}
            
            {/* Stats for doctors */}
            {user?.userType === 'doctor' && (
              <View className="flex-row mt-4 space-x-8">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-blue-600">127</Text>
                  <Text className="text-gray-500 text-sm">Patients</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-green-600">4.8</Text>
                  <Text className="text-gray-500 text-sm">Rating</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-purple-600">3</Text>
                  <Text className="text-gray-500 text-sm">Years Exp.</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Menu Items */}
        <View className="mx-4 mt-6">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
              onPress={item.onPress}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
                  <Ionicons name={item.icon as any} size={20} color="#2563eb" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">
                    {item.title}
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    {item.subtitle}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View className="mx-4 mt-6 mb-8">
          <TouchableOpacity
            className="bg-red-50 border border-red-200 rounded-xl p-4"
            onPress={handleLogout}
          >
            <View className="flex-row items-center justify-center">
              <MaterialIcons name="logout" size={20} color="#dc2626" />
              <Text className="text-red-600 font-semibold ml-2">
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
