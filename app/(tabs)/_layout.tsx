
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { useAuthStore } from '../../store/store';
import { AuthGuard } from '../../components/AuthGuard';
import { AntDesign } from '@expo/vector-icons';
import { NotificationButton } from '../../components/NotificationButton';
import { UserAvatar } from '../../components/UserAvatar';

export default function TabLayout() {
  const { user } = useAuthStore();
  // TODO: Replace with real unread count from store or API
  const unreadCount = 3;

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
            tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
            headerTitle: '',
            headerShadowVisible: false,
            headerLeft: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12 }}>
                <UserAvatar name={user?.name || 'User'} />
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#222' }}>{user?.name || 'User'}</Text>
              </View>
            ),
            headerRight: () => (
              <NotificationButton unreadCount={unreadCount} />
            ),
          }}
        />
        <Tabs.Screen
          name="appointments"
          options={{
            title: user?.userType === 'doctor' ? 'Patients' : 'Appointments',
            tabBarIcon: ({ color }) => <AntDesign name="calendar" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <AntDesign name="user" size={24} color={color} />,
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
