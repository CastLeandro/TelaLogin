import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Client } from '../../../types/Client';
import { clientApi } from '../../../utils/clientApi';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import DeleteButton from '../../../components/DeleteButton';
import { colors } from '../../../theme/colors';

interface EditableClient extends Client {
  isExpanded?: boolean;
  editedFields?: {
    [key: string]: string;
  };
}

export default function ClientList() {
  const [clients, setClients] = useState<EditableClient[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadClients = async () => {
    try {
      console.log('ClientList: Carregando clientes...');
      setIsLoading(true);
      const data = await clientApi.listClients();
      console.log('ClientList: Clientes carregados:', data);
      setClients(data.map(client => ({ ...client, isExpanded: false, editedFields: {} })));
    } catch (error) {
      console.error('ClientList: Erro ao carregar clientes:', error);
      Alert.alert('Erro', 'Não foi possível carregar os clientes. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClients();
    setRefreshing(false);
  };

  const handleDeleteSuccess = React.useCallback(() => {
    console.log('ClientList: Cliente excluído com sucesso, recarregando lista...');
    loadClients();
  }, []);

  useEffect(() => {
    loadClients();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log('ClientList: Tela recebeu foco, recarregando clientes...');
      loadClients();
    }, [])
  );

  const toggleExpand = (clientId: number) => {
    setClients(clients.map(client => ({
      ...client,
      isExpanded: client.id === clientId ? !client.isExpanded : false,
      editedFields: client.id === clientId ? (client.editedFields || {}) : {}
    })));
  };

  const handleFieldChange = (clientId: number, field: string, value: string) => {
    setClients(clients.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          editedFields: {
            ...client.editedFields,
            [field]: value
          }
        };
      }
      return client;
    }));
  };

  const handleUpdate = async (client: EditableClient) => {
    if (!client.editedFields || Object.keys(client.editedFields).length === 0) {
      Alert.alert('Aviso', 'Nenhuma alteração foi feita.');
      return;
    }

    try {
      const updatedData = {
        id: client.id,
        nome: client.editedFields.nome ?? client.nome,
        telefone: client.editedFields.telefone ?? client.telefone ?? undefined,
        endereco: client.editedFields.endereco ?? client.endereco,
        latitude: client.latitude ?? undefined,
        longitude: client.longitude ?? undefined
      };

      await clientApi.updateClient(updatedData);
      await loadClients();
      Alert.alert('Sucesso', 'Cliente atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o cliente.');
    }
  };

  const renderEditableField = (client: EditableClient, field: string, label: string) => {
    const currentValue = client.editedFields?.[field] ?? client[field as keyof Client] ?? '';
    const hasChanged = client.editedFields?.[field] !== undefined;

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput
          style={[styles.fieldInput, hasChanged && styles.fieldChanged]}
          value={String(currentValue || '')}
          onChangeText={(value) => handleFieldChange(client.id, field, value)}
          placeholder={`Digite o ${label.toLowerCase()}`}
          placeholderTextColor="#666"
        />
      </View>
    );
  };

  if (isLoading && clients.length === 0) {
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
        {clients.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={colors.primary} />
            <Text style={styles.emptyText}>Nenhum cliente cadastrado</Text>
          </View>
        ) : (
          clients.map((client) => (
            <View key={client.id} style={styles.clientCard}>
              <TouchableOpacity
                style={styles.clientHeader}
                onPress={() => toggleExpand(client.id)}
              >
                <View style={styles.clientInfo}>
                  {client.foto_caminho ? (
                    <Image
                      source={{ uri: client.foto_caminho }}
                      style={styles.clientImage}
                    />
                  ) : (
                    <View style={[styles.clientImage, styles.noImage]}>
                      <Ionicons name="person" size={30} color={colors.primary} />
                    </View>
                  )}
                  <View style={styles.textContainer}>
                    <Text style={styles.name}>{client.nome}</Text>
                    <Text style={styles.details}>{client.telefone || 'Sem telefone'}</Text>
                  </View>
                </View>
                <Ionicons
                  name={client.isExpanded ? "chevron-up" : "chevron-down"}
                  size={24}
                  color={colors.primary}
                />
              </TouchableOpacity>

              {client.isExpanded && (
                <View style={styles.expandedContent}>
                  {renderEditableField(client, 'nome', 'Nome')}
                  {renderEditableField(client, 'telefone', 'Telefone')}
                  {renderEditableField(client, 'endereco', 'Endereço')}
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.updateButton]}
                      onPress={() => handleUpdate(client)}
                    >
                      <Text style={styles.buttonText}>Salvar Alterações</Text>
                    </TouchableOpacity>
                    
                    <DeleteButton
                      clientId={client.id}
                      clientName={client.nome}
                      onSuccess={handleDeleteSuccess}
                    />
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/clients/create')}
      >
        <Ionicons name="add" size={24} color={colors.text.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
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
  clientCard: {
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
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  clientImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  noImage: {
    backgroundColor: colors.background.input,
    justifyContent: 'center',
    alignItems: 'center',
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: colors.button.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 