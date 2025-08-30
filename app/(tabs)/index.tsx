import { Stack, router } from 'expo-router';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useCategoriesStore } from '../../store/categoriesStore';

// Fallback categories data (local images mapping)
const getIconSource = (iconName: string) => {
  const icons: { [key: string]: any } = {
    heartbeat: require('../../assets/categories/heart.png'),
    pediatrician: require('../../assets/categories/baby-boy.png'),
    brain: require('../../assets/categories/brain.png'),
    teeth: require('../../assets/categories/smile.png'),
    stomach: require('../../assets/categories/stomach1.png'),
    kidney: require('../../assets/categories/urology.png'),
    cancer: require('../../assets/categories/cancer-cell.png'),
    homeopathy: require('../../assets/categories/herbal-treatment.png'),
    'healthcare-and-medical': require('../../assets/categories/healthcare-and-medical.png'),
    patient: require('../../assets/categories/patient.png'),
  };
  return icons[iconName] || icons['healthcare-and-medical'];
};

export default function Home() {
  const { categories, loading, fetchCategories } = useCategoriesStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        <View className="items-start justify-start p-5">
          <Text className="text-sm font-medium mb-2">Welcome back!</Text>
          <Text className='text-xl font-bold text-blue-500'>What are you looking for?</Text>
          <View className='w-full'>
            <TouchableOpacity 
              className='border border-gray-200 p-4 w-full rounded-lg mt-3 flex-row items-center justify-start'
              onPress={() => router.push('/search')}
            >
              {/* search icon */}
              <AntDesign name="search1" size={22} color="gray" />
              <Text className='text-sm text-gray-500 pl-4'>Search Doctors, Medicines, Hospitals...</Text>
            </TouchableOpacity>
          </View>
          <View className=' w-full p-1'>
            <View className="w-full mt-3">
              {/* Cards Grid - 2x2 layout */}
              <View className="flex-row justify-between mb-4">
                {/* Doctors Card */}
                <TouchableOpacity 
                  className="bg-blue-600 rounded-2xl p-4 w-[48%] h-32"
                  onPress={() => router.push('/doctors')}
                >
                  <Image 
                    source={require('../../assets/doctor.png')} 
                    className="w-8 h-12 mb-2"
                  />
                  <Text className="text-white text-lg font-semibold">Doctors</Text>
                  <Text className="text-white text-sm opacity-90">Book Appointment</Text>
                </TouchableOpacity>
                {/* Diagnostics Card */}
                <TouchableOpacity className="bg-blue-600 rounded-2xl p-4 w-[48%] h-32">
                  <Image 
                    source={require('../../assets/microscope.png')} 
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-white text-lg font-semibold">Diagnostics</Text>
                  <Text className="text-white text-sm opacity-90">Test & health checkup</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-between">
                {/* Hospitals Card */}
                <TouchableOpacity className="bg-blue-600 rounded-2xl p-4 w-[48%] h-32">
                  <Image 
                    source={require('../../assets/first-aid-kit.png')} 
                    className="w-8 h-8 mb-2"
                  />
                  <Text className="text-white text-lg font-semibold">Hospitals</Text>
                  <Text className="text-white text-sm opacity-90">Search Top Hospitals</Text>
                </TouchableOpacity>
                {/* Pharmacy Card */}
                <TouchableOpacity className="bg-blue-600 rounded-2xl p-4 w-[48%] h-32">
                  <Image 
                    source={require('../../assets/pill.png')} 
                    className="w-8 h-8 mb-2"
                  />
                  <Text className="text-white text-lg font-semibold">Pharmacy</Text>
                  <Text className="text-white text-sm opacity-90">Order medicines</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* Specialized Doctors Section */}
          <View className="w-full mt-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">Consult Specialized Doctors</Text>
              <TouchableOpacity>
                <Text className="text-blue-500 font-medium">View All</Text>
              </TouchableOpacity>
            </View>
            {/* Horizontal Slider */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="w-full"
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {loading ? (
                <Text className="text-gray-500 p-4">Loading specialties...</Text>
              ) : (
                categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    className="bg-white rounded-2xl p-4 mr-4 items-center shadow-sm border border-gray-100"
                    style={{ width: 140, height: 160 }}
                    onPress={() => router.push(`/specialty/${encodeURIComponent(category.name)}` as any)}
                  >
                    <View 
                      className="w-16 h-16 p-2 rounded-full items-center justify-center mb-1"
                      style={{ backgroundColor: category.color }}
                    >
                      <Image 
                        source={getIconSource(category.icon_name)} 
                        className="w-8 h-8 rounded-lg"
                      />
                    </View>
                    <Text className="text-center text-gray-800 font-medium text-sm mb-1">
                      {category.name}
                    </Text>
                    <Text className="text-center text-blue-500 font-medium text-xs">
                      {category.specialist_count} Specialist
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
          {/* Lab Test Section */}
          <View className="w-full mt-6 mb-6">
            <View 
              className="bg-orange-50 rounded-3xl p-6 mx-2"
              style={{ backgroundColor: '#FDF4E8' }}
            >
              <Text className="text-xl font-bold text-gray-800 mb-6">
                Lab Test From The{"\n"}Comfort Of Your Home
              </Text>
              {/* Features Row */}
              <View className="flex-row justify-between mb-6">
                {/* 100% Safe & Hygienic */}
                <View className="flex-1 items-center mr-4">
                  <View className="w-16 h-16 rounded-2xl items-center justify-center mb-3">
                    <Image 
                      source={require('../../assets/ad/shield.png')} 
                      className="w-8 h-10"
                    />
                  </View>
                  <Text className="text-center text-gray-800 font-medium text-sm">
                    100% Safe &{"\n"}Hygienic
                  </Text>
                </View>
                {/* View Reports Online */}
                <View className="flex-1 items-center ml-4">
                  <View className="w-16 h-16 rounded-2xl items-center justify-center mb-3">
                    <Image 
                      source={require('../../assets/ad/exam.png')} 
                      className="w-8 h-10"
                    />
                  </View>
                  <Text className="text-center text-gray-800 font-medium text-sm">
                    View Reports{"\n"}Online
                  </Text>
                </View>
              </View>
              {/* View All Packages Button */}
              <TouchableOpacity 
                className="bg-blue-500 rounded-xl py-4 px-6"
                // style={{ backgroundColor: '#1E3A8A' }}
              >
                <Text className="text-white text-center text-base font-semibold">
                  View All Packages
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
