import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  FlatList 
} from 'react-native';
import { Stack, router } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCategoriesStore, Category } from '../store/categoriesStore';

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

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Category[]>([]);
  const { categories, loading, fetchCategories } = useCategoriesStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement actual search logic here
    // For now, we'll filter categories based on search query
    if (query.trim()) {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

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
            <View className="px-5 mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-4">
                Search Results ({searchResults.length})
              </Text>
              {searchResults.length > 0 ? (
                <FlatList
                  data={searchResults}
                  renderItem={renderCategoryItem}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 20 }}
                />
              ) : (
                <View className="items-center py-8">
                  <Ionicons name="search-outline" size={48} color="#9CA3AF" />
                  <Text className="text-gray-500 mt-2">No results found</Text>
                  <Text className="text-gray-400 text-sm">Try searching with different keywords</Text>
                </View>
              )}
            </View>
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
          <View className="px-5 mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              All Specialties
            </Text>
            
            {loading ? (
              <View className="items-center py-8">
                <Text className="text-gray-500">Loading specialties...</Text>
              </View>
            ) : (
              <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
              />
            )}
          </View>

          
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
