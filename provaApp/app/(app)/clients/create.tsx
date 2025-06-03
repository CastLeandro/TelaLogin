import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import ClientForm from '../../../components/ClientForm';
import { ClientCreateInput } from '../../../types/Client';
import { clientApi } from '../../../utils/clientApi';

export default function CreateClient() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: ClientCreateInput | any) => {
    if (!('id' in data)) {
      setIsLoading(true);
      try {
        await clientApi.createClient(data as ClientCreateInput);
        Alert.alert('Sucesso', 'Cliente cadastrado com sucesso!', [
          { text: 'OK', onPress: () => router.replace('/clients/list') }
        ]);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível cadastrar o cliente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return <ClientForm onSubmit={handleSubmit} isLoading={isLoading} />;
} 