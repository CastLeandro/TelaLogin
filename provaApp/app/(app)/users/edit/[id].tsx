import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../../../theme/colors';
import { authenticatedFetch } from '../../../../utils/api';

interface User {
  id: number;
  username: string;
  email: string;
}

export default function EditUser() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });

  useEffect(() => {
    // O ID será passado como prop de navegação
    const loadUser = async (userId: string) => {
      try {
        setLoading(true);
        const response = await authenticatedFetch(`/users/${userId}`);
        if (!response.ok) {
          throw new Error('Falha ao carregar usuário');
        }
        const data = await response.json();
        setUser(data);
        setFormData(prev => ({
          ...prev,
          username: data.username,
          email: data.email,
        }));
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.', [
          {
            text: 'OK',
            onPress: () => router.push('/users/list'),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    // Tenta obter o ID da rota
    const userId = window.location.pathname.split('/').pop();
    if (userId) {
      loadUser(userId);
    } else {
      Alert.alert('Erro', 'ID do usuário não encontrado.', [
        {
          text: 'OK',
          onPress: () => router.push('/users/list'),
        },
      ]);
    }
  }, []);

  const handleUpdate = async () => {
    const userId = window.location.pathname.split('/').pop();
    if (!userId) {
      Alert.alert('Erro', 'ID do usuário não encontrado.');
      return;
    }

    if (!formData.username.trim() || !formData.email.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (formData.senha && formData.senha !== formData.confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    try {
      const updateData: any = {
        username: formData.username,
        email: formData.email,
      };

      if (formData.senha) {
        updateData.senha = formData.senha;
      }

      const response = await authenticatedFetch(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar usuário');
      }

      Alert.alert('Sucesso', 'Usuário atualizado com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.push('/users/list'),
        },
      ]);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o usuário.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Editar Usuário</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Nome de usuário</Text>
          <TextInput
            style={styles.input}
            value={formData.username}
            onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
            placeholder="Digite o nome de usuário"
            placeholderTextColor={colors.text.secondary}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            placeholder="Digite o email"
            placeholderTextColor={colors.text.secondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Nova Senha (opcional)</Text>
          <TextInput
            style={styles.input}
            value={formData.senha}
            onChangeText={(text) => setFormData(prev => ({ ...prev, senha: text }))}
            placeholder="Digite a nova senha"
            placeholderTextColor={colors.text.secondary}
            secureTextEntry
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Confirmar Nova Senha</Text>
          <TextInput
            style={styles.input}
            value={formData.confirmarSenha}
            onChangeText={(text) => setFormData(prev => ({ ...prev, confirmarSenha: text }))}
            placeholder="Confirme a nova senha"
            placeholderTextColor={colors.text.secondary}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Atualizar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  contentContainer: {
    padding: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.background.light,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background.input,
    borderRadius: 8,
    padding: 12,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.background.input,
  },
  button: {
    backgroundColor: colors.button.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 