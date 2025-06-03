import React, { useEffect, useState } from 'react';
import { Alert, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ClientForm from '../../../../components/ClientForm';
import { Client, ClientCreateInput, ClientUpdateInput } from '../../../../types/Client';
import { clientApi } from '../../../../utils/clientApi';

export default function EditClient() {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadClient = async () => {
      try {
        // Pega o ID da URL atual
        const paths = window.location.pathname.split('/');
        const id = paths[paths.length - 1];
        
        if (!id || isNaN(Number(id))) {
          Alert.alert('Erro', 'ID do cliente inválido');
          router.replace('/clients/list');
          return;
        }

        const clientId = parseInt(id, 10);
        const data = await clientApi.getClientById(clientId);
        setClient(data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do cliente.');
        router.replace('/clients/list');
      } finally {
        setIsFetching(false);
      }
    };

    loadClient();
  }, []);

  const handleSubmit = async (data: ClientCreateInput | ClientUpdateInput) => {
    if (!client) return;
    
    setIsLoading(true);
    try {
      await clientApi.updateClient({ ...data, id: client.id });
      Alert.alert('Sucesso', 'Cliente atualizado com sucesso!', [
        { text: 'OK', onPress: () => router.replace('/clients/list') }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o cliente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return client ? (
    <ClientForm
      initialData={client}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  ) : null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B1026',
  },
}); 