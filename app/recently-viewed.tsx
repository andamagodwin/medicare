import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRecentlyViewedStore, RecentDoctor } from '../store/recentlyViewedStore';
import { UserAvatar } from '../components/UserAvatar';

export default function RecentlyViewedScreen() {
  const { recentDoctors, clearRecentDoctors } = useRecentlyViewedStore();

  const formatViewedTime = (viewedAt: string) => {
    const now = new Date();
    const viewed = new Date(viewedAt);
    const diffInHours = Math.floor((now.getTime() - viewed.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleClearAll = () => {
    clearRecentDoctors();
  };

  const renderDoctorItem = ({ item }: { item: RecentDoctor }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
      onPress={() => router.push(`/doctor/${item.$id}` as any)}
    >
      <View className="flex-row items-start">
        <UserAvatar name={item.name} size={60} />
        <View className="flex-1 ml-4">
          <Text className="text-lg font-bold text-gray-900">Dr. {item.name}</Text>
          <Text className="text-blue-600 font-medium capitalize mb-2">
            {item.speciality || 'General Physician'}
          </Text>
          
          <View className="flex-row items-center mb-2">
            <Ionicons name="star" size={16} color="#FCD34D" />
            <Text className="text-gray-700 ml-1 font-medium">
              {item.rating || '4.8'}
            </Text>
            <Text className="text-gray-500 ml-4">
              {item.experience || '5+'} years experience
            </Text>
          </View>
          
          {item.hospital && (
            <View className="flex-row items-center mb-2">
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-1">{item.hospital}</Text>
            </View>
          )}
          
          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center">
              <Text className="text-green-600 font-bold text-lg">
                ${item.consultationFee || '50'}
              </Text>
              <Text className="text-gray-500 ml-1">consultation</Text>
            </View>
            <Text className="text-gray-400 text-sm">
              Viewed {formatViewedTime(item.viewedAt)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View className="flex-1 items-center justify-center py-16">
      <Ionicons name="time-outline" size={64} color="#9CA3AF" />
      <Text className="text-gray-500 text-lg mt-4">No recently viewed doctors</Text>
      <Text className="text-gray-400 text-center mt-2">
        Doctors you view will appear here for quick access
      </Text>
    </View>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: '',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <View className="flex-row items-center">
              <TouchableOpacity 
                onPress={() => router.back()} 
                className="mr-3 p-2 rounded-full bg-gray-100"
              >
                <Ionicons name="arrow-back" size={20} color="#374151" />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-gray-900">
                Recently Viewed
              </Text>
            </View>
          ),
          headerRight: () => (
            recentDoctors.length > 0 && (
              <TouchableOpacity 
                className="p-2"
                onPress={handleClearAll}
              >
                <Text className="text-red-500 font-medium">Clear All</Text>
              </TouchableOpacity>
            )
          ),
        }} 
      />
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header Info */}
        <View className="bg-white px-5 py-4 border-b border-gray-100">
          <Text className="text-gray-600">
            {recentDoctors.length} doctor{recentDoctors.length !== 1 ? 's' : ''} viewed recently
          </Text>
        </View>

        <FlatList
          data={recentDoctors}
          renderItem={renderDoctorItem}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyState}
        />
      </SafeAreaView>
    </>
  );
}
