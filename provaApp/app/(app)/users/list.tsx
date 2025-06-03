import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { authenticatedFetch } from '../../../utils/api';

interface User {
  id: number;
  username: string;
  email: string;
  isExpanded?: boolean;
  editedFields?: {
    [key: string]: string;
  };
}

export default function UserList() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    try {
      console.log('UserList: Carregando usuários...');
      setIsLoading(true);
      const response = await authenticatedFetch('/users');
      if (!response.ok) {
        throw new Error('Falha ao carregar usuários');
      }
      const data = await response.json();
      console.log('UserList: Usuários carregados:', data);
      setUsers(data.map((user: User) => ({ ...user, isExpanded: false, editedFields: {} })));
    } catch (error) {
      console.error('UserList: Erro ao carregar usuários:', error);
      Alert.alert('Erro', 'Não foi possível carregar os usuários. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const toggleExpand = (userId: number) => {
    setUsers(users.map(user => ({
      ...user,
      isExpanded: user.id === userId ? !user.isExpanded : false,
      editedFields: user.id === userId ? (user.editedFields || {}) : {}
    })));
  };

  const handleFieldChange = (userId: number, field: string, value: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          editedFields: {
            ...user.editedFields,
            [field]: value
          }
        };
      }
      return user;
    }));
  };

  const handleUpdate = async (user: User) => {
    if (!user.editedFields || Object.keys(user.editedFields).length === 0) {
      Alert.alert('Aviso', 'Nenhuma alteração foi feita.');
      return;
    }

    try {
      const updatedData = {
        username: user.editedFields.username ?? user.username,
        email: user.editedFields.email ?? user.email,
      };

      const response = await authenticatedFetch(`/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar usuário');
      }

      await loadUsers();
      Alert.alert('Sucesso', 'Usuário atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o usuário.');
    }
  };

  const handleEdit = (userId: number) => {
    router.push(`/users/edit/${userId}`);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log('UserList: Tela recebeu foco, recarregando usuários...');
      loadUsers();
    }, [])
  );

  const renderEditableField = (user: User, field: string, label: string) => {
    const currentValue = user.editedFields?.[field] ?? user[field as keyof User] ?? '';
    const hasChanged = user.editedFields?.[field] !== undefined;

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput
          style={[styles.fieldInput, hasChanged && styles.fieldChanged]}
          value={String(currentValue)}
          onChangeText={(value) => handleFieldChange(user.id, field, value)}
          placeholder={`Digite o ${label.toLowerCase()}`}
          placeholderTextColor="#666"
        />
      </View>
    );
  };

  if (isLoading && users.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {users.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={colors.primary} />
            <Text style={styles.emptyText}>Nenhum usuário encontrado</Text>
          </View>
        ) : (
          users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <TouchableOpacity
                style={styles.userHeader}
                onPress={() => toggleExpand(user.id)}
              >
                <View style={styles.userInfo}>
                  <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={30} color={colors.primary} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.name}>{user.username}</Text>
                    <Text style={styles.details}>{user.email}</Text>
                  </View>
                </View>
                <View style={styles.actionIcons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(user.id)}
                  >
                    <Ionicons name="create" size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <Ionicons
                    name={user.isExpanded ? "chevron-up" : "chevron-down"}
                    size={24}
                    color={colors.primary}
                  />
                </View>
              </TouchableOpacity>

              {user.isExpanded && (
                <View style={styles.expandedContent}>
                  {renderEditableField(user, 'username', 'Nome de usuário')}
                  {renderEditableField(user, 'email', 'Email')}
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.updateButton]}
                      onPress={() => handleUpdate(user)}
                    >
                      <Text style={styles.buttonText}>Salvar Alterações</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: colors.text.secondary,
    fontSize: 16,
    marginTop: 16,
  },
  userCard: {
    backgroundColor: colors.background.light,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background.input,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  details: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  expandedContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.background.input,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  fieldInput: {
    backgroundColor: colors.background.input,
    borderRadius: 8,
    padding: 12,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.background.input,
  },
  fieldChanged: {
    borderColor: colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  updateButton: {
    backgroundColor: colors.button.primary,
  },
  buttonText: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
}); 