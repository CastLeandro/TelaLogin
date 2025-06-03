import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const inAuthGroup = segments[0] === '(auth)';
      const inAppGroup = segments[0] === '(app)';

      if (!token && !inAuthGroup) {
        // Redirect to login if no token and not in auth group
        router.replace({ pathname: '/' });
      } else if (token && (inAuthGroup || segments.length === 0)) {
        // Redirect to home if has token and in auth group or at root
        router.replace({ pathname: '/(app)/home' });
      }
    };

    checkAuth();
  }, [segments]);

  return <Slot />;
} 