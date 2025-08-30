import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getDoctorById } from '../../lib/appwrite';
import { UserAvatar } from '../../components/UserAvatar';
import { useRecentlyViewedStore } from '../../store/recentlyViewedStore';

interface Doctor {
  $id: string;
  name: string;
  email: string;
  userType: string;
  speciality?: string;
  experience?: string;
  qualifications?: string;
  about?: string;
  rating?: number;
  consultationFee?: number;
  hospital?: string;
  availability?: string[];
}

export default function DoctorDetailsScreen() {
  const { doctorId } = useLocalSearchParams<{ doctorId: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const { addRecentDoctor } = useRecentlyViewedStore();

  const loadDoctorDetails = useCallback(async () => {
    try {
      setLoading(true);
      const doctorData = await getDoctorById(doctorId);
      const doctorInfo = doctorData as unknown as Doctor;
      // Debug: log raw doctor data and field types to catch unexpected values
      console.debug('doctorData raw', doctorData);
      try {
        console.debug('doctor fields:', {
          name: typeof doctorInfo?.name,
          speciality: typeof doctorInfo?.speciality,
          experience: typeof doctorInfo?.experience,
          about: typeof doctorInfo?.about,
          qualifications: Array.isArray((doctorInfo as any)?.qualifications) ? 'array' : typeof (doctorInfo as any)?.qualifications,
          availability: Array.isArray((doctorInfo as any)?.availability) ? 'array' : typeof (doctorInfo as any)?.availability,
          consultationFee: typeof doctorInfo?.consultationFee,
          hospital: typeof doctorInfo?.hospital,
        });
      } catch (e) {
        console.warn('Error logging doctor fields', e);
      }
      setDoctor(doctorInfo);
      
      // Track this doctor as recently viewed
      if (doctorInfo) {
        addRecentDoctor({
          $id: doctorInfo.$id,
          name: doctorInfo.name,
          speciality: doctorInfo.speciality,
          rating: doctorInfo.rating,
          experience: doctorInfo.experience,
          hospital: doctorInfo.hospital,
          consultationFee: doctorInfo.consultationFee,
        });
      }
    } catch (error) {
      console.error('Error loading doctor details:', error);
      Alert.alert('Error', 'Failed to load doctor details');
    } finally {
      setLoading(false);
    }
  }, [doctorId, addRecentDoctor]);

  useEffect(() => {
    if (doctorId) {
      loadDoctorDetails();
    }
  }, [doctorId, loadDoctorDetails]);

  const handleBookAppointment = () => {
    // TODO: Implement appointment booking
    Alert.alert('Book Appointment', 'Appointment booking coming soon!');
  };

  const handleCall = () => {
    // TODO: Implement calling functionality
    Alert.alert('Call Doctor', 'Calling functionality coming soon!');
  };

  const handleMessage = () => {
    // TODO: Implement messaging functionality
    Alert.alert('Message Doctor', 'Messaging functionality coming soon!');
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen 
          options={{ 
            title: '',
            headerStyle: { backgroundColor: '#ffffff' },
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} className="p-2">
                <Ionicons name="arrow-back" size={20} color="#374151" />
              </TouchableOpacity>
            ),
          }} 
        />
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Loading doctor details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!doctor) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen 
          options={{ 
            title: '',
            headerStyle: { backgroundColor: '#ffffff' },
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} className="p-2">
                <Ionicons name="arrow-back" size={20} color="#374151" />
              </TouchableOpacity>
            ),
          }} 
        />
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Doctor not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: '',
          headerStyle: { backgroundColor: '#ffffff' },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <Ionicons name="arrow-back" size={20} color="#374151" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity className="p-2">
              <Ionicons name="heart-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          ),
        }} 
      />
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Doctor Profile Card */}
          <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm border border-gray-100">
            <View className="items-center">
              <UserAvatar name={doctor.name} size={80} />
              <Text className="text-xl font-bold text-gray-900 mt-4">
                Dr. {doctor.name}
              </Text>
              <Text className="text-blue-600 font-medium capitalize">
                {doctor.speciality || 'General Physician'}
              </Text>
              
              {/* Rating and Experience */}
              <View className="flex-row mt-4 space-x-8">
                <View className="items-center">
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={16} color="#FCD34D" />
                    <Text className="text-lg font-bold text-gray-900 ml-1">
                      {doctor.rating || '4.8'}
                    </Text>
                  </View>
                  <Text className="text-gray-500 text-sm">Rating</Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-bold text-gray-900">
                    {doctor.experience || '5+'}
                  </Text>
                  <Text className="text-gray-500 text-sm">Years Exp.</Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-bold text-gray-900">
                    {`$${doctor.consultationFee || '50'}`}
                  </Text>
                  <Text className="text-gray-500 text-sm">Consultation</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="flex-row mx-4 mt-4 space-x-3">
            <TouchableOpacity 
              className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 items-center"
              onPress={handleCall}
            >
              <Ionicons name="call" size={20} color="#2563eb" />
              <Text className="text-blue-600 font-medium mt-1">Call</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4 items-center"
              onPress={handleMessage}
            >
              <Ionicons name="chatbubble" size={20} color="#16a34a" />
              <Text className="text-green-600 font-medium mt-1">Message</Text>
            </TouchableOpacity>
          </View>

          {/* About Section */}
          <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm border border-gray-100">
            <Text className="text-lg font-bold text-gray-900 mb-3">About</Text>
            <Text className="text-gray-600 leading-6">
              {String(doctor.about || `Dr. ${doctor.name} is a experienced ${doctor.speciality || 'physician'} with over ${doctor.experience || '5'} years of practice. Dedicated to providing comprehensive healthcare services with a patient-centered approach.`)}
            </Text>
          </View>

          {/* Qualifications */}
          <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm border border-gray-100">
            <Text className="text-lg font-bold text-gray-900 mb-3">Qualifications</Text>
            <View className="space-y-3">
              {(
                Array.isArray(doctor.qualifications)
                  ? doctor.qualifications
                  : (typeof doctor.qualifications === 'string' ? doctor.qualifications.split(',') : ['MBBS', 'MD - Internal Medicine'])
              ).map((qualification, index) => (
                <View key={index} className="flex-row items-center">
                  <View className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                  <Text className="text-gray-700">{String(qualification).trim()}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Hospital/Clinic */}
          <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm border border-gray-100">
            <Text className="text-lg font-bold text-gray-900 mb-3">Hospital/Clinic</Text>
            <View className="flex-row items-center">
              <MaterialIcons name="local-hospital" size={20} color="#6B7280" />
              <Text className="text-gray-700 ml-3">
                {doctor.hospital || 'City General Hospital'}
              </Text>
            </View>
          </View>

          {/* Availability */}
          <View className="bg-white mx-4 mt-4 mb-6 rounded-2xl p-6 shadow-sm border border-gray-100">
            <Text className="text-lg font-bold text-gray-900 mb-3">Availability</Text>
            <View className="space-y-2">
              {(Array.isArray(doctor.availability) ? doctor.availability : [String(doctor.availability || 'Mon-Fri: 9:00 AM - 6:00 PM'), 'Sat: 9:00 AM - 2:00 PM']).map((time, index) => (
                <View key={index} className="flex-row items-center">
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text className="text-gray-700 ml-2">{String(time)}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Button */}
        <View className="bg-white border-t border-gray-200 p-4">
          <TouchableOpacity
            className="bg-blue-600 rounded-xl p-4 items-center"
            onPress={handleBookAppointment}
          >
            <Text className="text-white font-semibold text-lg">Book Appointment</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}
