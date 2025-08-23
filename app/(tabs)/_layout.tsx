import { Tabs, router } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import { useAuthStore } from '../../store/store';
import { AuthGuard } from '../../components/AuthGuard';

import { TabBarIcon } from '../../components/TabBarIcon';

export default function TabLayout() {
  const { logout, user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#2563eb',
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            headerTitle: `Welcome, ${user?.name || 'User'}`,
            headerRight: () => (
              <TouchableOpacity onPress={handleLogout} className="mr-4">
                <Text className="text-blue-600 font-semibold">Logout</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            title: user?.userType === 'doctor' ? 'Patients' : 'Appointments',
            tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
