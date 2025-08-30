import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useCategoriesStore } from '../store/categoriesStore';

export default function DoctorsScreen() {
  const { categories, loading, fetchCategories } = useCategoriesStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSpecialtyPress = (specialty: any) => {
    // Navigate to specialty screen to show doctors in that specialty
    router.push(`/specialty/${encodeURIComponent(specialty.name)}` as any);
  };

  const handleSearchMore = () => {
    router.push('/search');
  };

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
                className="mr-3 p-2"
              >
                <Ionicons name="arrow-back" size={20} color="#374151" />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-gray-900">Find Doctors</Text>
            </View>
          ),
        }} 
      />
      <SafeAreaView className="flex-1 bg-white">
        {/* Search Bar */}
        <View className="px-5 py-4">
          <TouchableOpacity 
            className="flex-row items-center bg-gray-50 rounded-lg p-4 border border-gray-200"
            onPress={() => router.push('/search')}
          >
            <AntDesign name="search1" size={20} color="gray" />
            <Text className="flex-1 ml-3 text-gray-500">
              Search Doctors, Specialities, Clinic
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
          {/* Search by Specialty */}
          <Text className="text-lg font-bold text-gray-900 mb-6">
            Search by Specialty
          </Text>

          {loading ? (
            <View className="items-center py-8">
              <Text className="text-gray-500">Loading specialties...</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={category.id}
                  className="items-center mb-8"
                  style={{ width: '48%' }}
                  onPress={() => handleSpecialtyPress(category)}
                >
                  <View 
                    className="w-16 h-16 rounded-full items-center justify-center mb-3"
                    style={{ backgroundColor: '#3B4BA8' }}
                  >
                    <View 
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: category.color || '#60A5FA' }}
                    >
                      <Ionicons 
                        name={getSpecialtyIcon(category.name)} 
                        size={20} 
                        color="white" 
                      />
                    </View>
                  </View>
                  <Text className="text-center font-semibold text-gray-900 mb-1">
                    {category.name}
                  </Text>
                  <Text className="text-center text-blue-500 text-sm">
                    {category.specialist_count} Specialist
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Search More Button */}
          <View className="items-center py-8 mb-8">
            <Text className="text-gray-600 mb-4">
              Didn&apos;t find what you looking for
            </Text>
            <TouchableOpacity
              className="bg-white border border-blue-500 rounded-lg px-6 py-3"
              onPress={handleSearchMore}
            >
              <Text className="text-blue-500 font-semibold">Search More</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

// Helper function to get appropriate icons for specialties
function getSpecialtyIcon(specialtyName: string): any {
  const iconMap: { [key: string]: any } = {
    'Cardiology': 'heart',
    'Pediatrician': 'person',
    'Homeopathy': 'medical',
    'General Physician': 'medical-outline',
    'Kidney Issues': 'water',
    'Mental Wellness': 'happy-outline',
    'Digestive': 'restaurant',
    'Cancer': 'shield',
    'Surgery': 'person-outline',
    'Dental Care': 'happy',
  };
  
  return iconMap[specialtyName] || 'medical-outline';
}
