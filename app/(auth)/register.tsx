import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuthStore, RegisterData } from '../../store/store';

export default function Register() {
  const [userType, setUserType] = useState<'patient' | 'doctor' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    // Patient specific
    dateOfBirth: '',
    address: '',
    // Doctor specific
    specialization: '',
    licenseNumber: '',
  });

  const { register, isLoading } = useAuthStore();

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!userType) {
      Alert.alert('Error', 'Please select whether you are a patient or doctor');
      return;
    }

    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Validate doctor-specific fields
    if (userType === 'doctor' && (!formData.specialization || !formData.licenseNumber)) {
      Alert.alert('Error', 'Please fill in specialization and license number');
      return;
    }

    try {
      const registerData: RegisterData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType,
        phone: formData.phone || undefined,
        ...(userType === 'patient' && {
          dateOfBirth: formData.dateOfBirth || undefined,
          address: formData.address || undefined,
        }),
        ...(userType === 'doctor' && {
          specialization: formData.specialization,
          licenseNumber: formData.licenseNumber,
        }),
      };

      await register(registerData);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-gray-600">Creating your account...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-16 pb-10">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
          <Text className="text-lg text-gray-600">Join Medicare today</Text>
        </View>

        {/* User Type Selection */}
        {!userType && (
          <View className="mb-8">
            <Text className="text-lg font-semibold text-gray-900 mb-4">I am a:</Text>
            
            <TouchableOpacity
              className="border-2 border-blue-200 bg-blue-50 rounded-lg p-6 mb-4"
              onPress={() => setUserType('patient')}
            >
              <Text className="text-xl font-semibold text-blue-700 mb-2">Patient</Text>
              <Text className="text-gray-600">
                Looking for medical care and consultation
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="border-2 border-green-200 bg-green-50 rounded-lg p-6"
              onPress={() => setUserType('doctor')}
            >
              <Text className="text-xl font-semibold text-green-700 mb-2">Doctor</Text>
              <Text className="text-gray-600">
                Medical professional providing healthcare services
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Registration Form */}
        {userType && (
          <View className="space-y-4">
            {/* User Type Display */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-900">
                Registering as: {userType === 'patient' ? 'Patient' : 'Doctor'}
              </Text>
              <TouchableOpacity onPress={() => setUserType(null)}>
                <Text className="text-blue-600">Change</Text>
              </TouchableOpacity>
            </View>

            {/* Common Fields */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Full Name *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                autoCapitalize="words"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Email *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Password *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
                placeholder="Create a strong password"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Phone Number</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            </View>

            {/* Patient-specific fields */}
            {userType === 'patient' && (
              <>
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">Date of Birth</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
                    placeholder="DD/MM/YYYY"
                    value={formData.dateOfBirth}
                    onChangeText={(value) => updateFormData('dateOfBirth', value)}
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">Address</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChangeText={(value) => updateFormData('address', value)}
                    multiline
                    numberOfLines={2}
                  />
                </View>
              </>
            )}

            {/* Doctor-specific fields */}
            {userType === 'doctor' && (
              <>
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">Specialization *</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
                    placeholder="e.g., Cardiology, Pediatrics"
                    value={formData.specialization}
                    onChangeText={(value) => updateFormData('specialization', value)}
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">Medical License Number *</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
                    placeholder="Enter your license number"
                    value={formData.licenseNumber}
                    onChangeText={(value) => updateFormData('licenseNumber', value)}
                  />
                </View>
              </>
            )}

            <TouchableOpacity
              className="bg-blue-600 py-4 rounded-lg items-center mt-8"
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold text-lg">Create Account</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer */}
        <View className="mt-8 items-center">
          <Text className="text-gray-600">Already have an account?</Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity className="mt-2">
              <Text className="text-blue-600 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
