import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Your Galaxy</Text>
        <Text style={styles.subtitle}>You're now logged in!</Text>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1026', // Deep space blue
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    textShadowColor: '#6C63FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#9f9f9f',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: '#6C63FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    maxWidth: 200,
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 