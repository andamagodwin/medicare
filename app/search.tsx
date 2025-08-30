import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  FlatList 
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCategoriesStore, Category } from '../store/categoriesStore';
import { searchDoctors } from '../lib/appwrite';
import { UserAvatar } from '../components/UserAvatar';

// Fallback categories data (local images mapping)
const getIconSource = (iconName: string) => {
  const icons: { [key: string]: any } = {
    heartbeat: require('../assets/categories/heart.png'),
    pediatrician: require('../assets/categories/baby-boy.png'),
    brain: require('../assets/categories/brain.png'),
    teeth: require('../assets/categories/smile.png'),
    stomach: require('../assets/categories/stomach1.png'),
    kidney: require('../assets/categories/urology.png'),
    cancer: require('../assets/categories/cancer-cell.png'),
    homeopathy: require('../assets/categories/herbal-treatment.png'),
    'healthcare-and-medical': require('../assets/categories/healthcare-and-medical.png'),
    patient: require('../assets/categories/patient.png'),
  };
  return icons[iconName] || icons['healthcare-and-medical'];
};

interface Doctor {
  $id: string;
  name: string;
  email: string;
  userType: string;
  speciality?: string;
  experience?: string;
  rating?: number;
  hospital?: string;
}

export default function SearchScreen() {
  const { specialty } = useLocalSearchParams<{ specialty?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Category[]>([]);
  const [doctorResults, setDoctorResults] = useState<Doctor[]>([]);
  const { categories, fetchCategories } = useCategoriesStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      // Search categories
      const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredCategories);
      
      // Search doctors
      try {
        const doctors = await searchDoctors(query);
        setDoctorResults(doctors as unknown as Doctor[]);
      } catch (error) {
        console.error('Error searching doctors:', error);
        setDoctorResults([]);
      }
    } else {
      setSearchResults([]);
      setDoctorResults([]);
    }
  }, [categories]);

  // Auto-search when specialty parameter is provided
  useEffect(() => {
    if (specialty) {
      handleSearch(specialty);
    }
  }, [specialty, handleSearch]);

  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mr-4 items-center shadow-sm border border-gray-100"
      style={{ width: 140, height: 160 }}
    >
      <View 
        className="w-16 h-16 p-2 rounded-full items-center justify-center mb-1"
        style={{ backgroundColor: item.color }}
      >
        <Image 
          source={getIconSource(item.icon_name)} 
          className="w-8 h-8 rounded-lg"
        />
      </View>
      <Text className="text-center text-gray-800 font-medium text-sm mb-1">
        {item.name}
      </Text>
      <Text className="text-center text-blue-500 font-medium text-xs">
        {item.specialist_count} Specialist
      </Text>
    </TouchableOpacity>
  );

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
      onPress={() => router.push(`/doctor/${item.$id}` as any)}
    >
      <View className="flex-row items-center">
        <UserAvatar name={item.name} size={50} />
        <View className="flex-1 ml-3">
          <Text className="font-semibold text-gray-900">Dr. {item.name}</Text>
          <Text className="text-blue-600 capitalize">{item.speciality || 'General Physician'}</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="star" size={14} color="#FCD34D" />
            <Text className="text-gray-600 text-sm ml-1">{item.rating || '4.8'}</Text>
            <Text className="text-gray-400 text-sm ml-2">• {item.experience || '5+'} years</Text>
          </View>
          {item.hospital && (
            <Text className="text-gray-500 text-sm mt-1">{item.hospital}</Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
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
              <Text className="text-xl font-bold text-gray-900">Search</Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity className="p-2">
              <Ionicons name="filter-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          ),
        }} 
      />
      <SafeAreaView className="flex-1 bg-white">
        {/* Search Header */}
        <View className="p-5 pb-3">
          <View className="flex-row items-center bg-gray-50 rounded-lg p-4 border border-gray-200">
            <AntDesign name="search1" size={20} color="gray" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="Search Doctors, Medicines, Hospitals..."
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Ionicons name="close-circle" size={20} color="gray" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Search Results */}
          {searchQuery.length > 0 && (
            <>
              {/* Doctor Results */}
              {doctorResults.length > 0 && (
                <View className="px-5 mb-6">
                  <Text className="text-lg font-bold text-gray-800 mb-4">
                    Doctors ({doctorResults.length})
                  </Text>
                  <FlatList
                    data={doctorResults}
                    renderItem={renderDoctorItem}
                    keyExtractor={(item) => item.$id}
                    scrollEnabled={false}
                  />
                </View>
              )}

              {/* Specialty Results */}
              {searchResults.length > 0 && (
                <View className="px-5 mb-6">
                  <Text className="text-lg font-bold text-gray-800 mb-4">
                    Specialties ({searchResults.length})
                  </Text>
                  <FlatList
                    data={searchResults}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 20 }}
                  />
                </View>
              )}

              {/* No Results */}
              {doctorResults.length === 0 && searchResults.length === 0 && (
                <View className="px-5 mb-6">
                  <View className="items-center py-8">
                    <Ionicons name="search-outline" size={48} color="#9CA3AF" />
                    <Text className="text-gray-500 mt-2">No results found</Text>
                    <Text className="text-gray-400 text-sm">Try searching with different keywords</Text>
                  </View>
                </View>
              )}
            </>
          )}

          {/* Quick Search Categories */}
          <View className="px-5 mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Quick Search
            </Text>
            <View className="flex-row flex-wrap">
              {['Cardiology', 'Pediatrics', 'Neurology', 'Orthopedics', 'Dermatology', 'Gynecology'].map((specialty) => (
                <TouchableOpacity
                  key={specialty}
                  className="bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mr-2 mb-2"
                  onPress={() => handleSearch(specialty)}
                >
                  <Text className="text-blue-600 font-medium">{specialty}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* All Categories */}
          
          
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
