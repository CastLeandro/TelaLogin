import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { register } from '../../utils/api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const result = await register({ username, email, senha: password });
    
    if (result.error) {
      Alert.alert('Error', result.error);
    } else {
      Alert.alert('Success', 'Registration successful! Please login.', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#9f9f9f"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9f9f9f"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9f9f9f"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity 
          style={styles.registerButton}
          onPress={handleRegister}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <Link href="/" asChild>
          <TouchableOpacity 
            style={styles.loginButton}
            activeOpacity={0.6}
          >
            <Text style={styles.loginText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1026',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: 'bold',
    textShadowColor: '#6C63FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    padding: 15,
    borderRadius: 12,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2E3A59',
    width: '100%',
  },
  registerButton: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loginButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#6C63FF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
}); 