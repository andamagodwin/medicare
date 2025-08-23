import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../store/store';

export default function Home() {
  const { user } = useAuthStore();

  const PatientDashboard = () => (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Welcome Section */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </Text>
          <Text className="text-gray-600">
            How are you feeling today?
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</Text>
          
          <View className="space-y-3">
            <TouchableOpacity className="bg-blue-600 rounded-lg p-4">
              <Text className="text-white font-semibold text-lg">Book Appointment</Text>
              <Text className="text-blue-100">Schedule with your doctor</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-green-600 rounded-lg p-4">
              <Text className="text-white font-semibold text-lg">View Medical Records</Text>
              <Text className="text-green-100">Access your health history</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-purple-600 rounded-lg p-4">
              <Text className="text-white font-semibold text-lg">Prescription Refill</Text>
              <Text className="text-purple-100">Request medication refills</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</Text>
          <Text className="text-gray-500">No recent activity</Text>
        </View>
      </View>
    </ScrollView>
  );

  const DoctorDashboard = () => (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Welcome Section */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Dr. {user?.name}
          </Text>
          <Text className="text-gray-600">
            {user?.specialization}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            License: {user?.licenseNumber}
          </Text>
        </View>

        {/* Today&apos;s Schedule */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Schedule</Text>
          
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-gray-500">No appointments scheduled for today</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</Text>
          
          <View className="space-y-3">
            <TouchableOpacity className="bg-blue-600 rounded-lg p-4">
              <Text className="text-white font-semibold text-lg">View Patient Records</Text>
              <Text className="text-blue-100">Access patient information</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-green-600 rounded-lg p-4">
              <Text className="text-white font-semibold text-lg">Create Prescription</Text>
              <Text className="text-green-100">Write new prescriptions</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-orange-600 rounded-lg p-4">
              <Text className="text-white font-semibold text-lg">Update Availability</Text>
              <Text className="text-orange-100">Manage your schedule</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics */}
        <View className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">This Week</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">0</Text>
              <Text className="text-gray-600">Appointments</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">0</Text>
              <Text className="text-gray-600">Patients</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-purple-600">0</Text>
              <Text className="text-gray-600">Prescriptions</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View className="flex-1">
      {user?.userType === 'doctor' ? <DoctorDashboard /> : <PatientDashboard />}
    </View>
  );
}
