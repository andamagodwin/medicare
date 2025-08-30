import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { searchDoctors } from '../../lib/appwrite';
import { UserAvatar } from '../../components/UserAvatar';

interface Doctor {
  $id: string;
  name: string;
  email: string;
  userType: string;
  speciality?: string;
  experience?: string;
  rating?: number;
  hospital?: string;
  consultationFee?: number;
}

export default function SpecialtyScreen() {
  const { specialty } = useLocalSearchParams<{ specialty: string }>();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDoctorsBySpecialty = useCallback(async () => {
    try {
      setLoading(true);
      const doctorsList = await searchDoctors('', specialty);
      setDoctors(doctorsList as unknown as Doctor[]);
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  }, [specialty]);

  useEffect(() => {
    if (specialty) {
      loadDoctorsBySpecialty();
    }
  }, [specialty, loadDoctorsBySpecialty]);

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
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
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-green-700 text-sm font-medium">Available</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View className="flex-1 items-center justify-center py-16">
      <Ionicons name="medical-outline" size={64} color="#9CA3AF" />
      <Text className="text-gray-500 text-lg mt-4">No doctors found</Text>
      <Text className="text-gray-400 text-center mt-2">
        No doctors available for {specialty} specialty at the moment
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
                {specialty} Doctors
              </Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity className="p-2">
              <Ionicons name="filter-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          ),
        }} 
      />
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header Info */}
        <View className="bg-white px-5 py-4 border-b border-gray-100">
          <Text className="text-gray-600">
            Showing {doctors.length} doctors for
          </Text>
          <Text className="text-lg font-bold text-blue-600 capitalize">
            {specialty}
          </Text>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2563eb" />
            <Text className="text-gray-500 mt-2">Loading doctors...</Text>
          </View>
        ) : (
          <FlatList
            data={doctors}
            renderItem={renderDoctorItem}
            keyExtractor={(item) => item.$id}
            contentContainerStyle={{ padding: 20 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={EmptyState}
          />
        )}
      </SafeAreaView>
    </>
  );
}
