import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
import { clientApi } from '../utils/clientApi';
import { colors } from '../theme/colors';

interface DeleteButtonProps {
  clientId: number;
  clientName: string;
  onSuccess: () => void;
}

export default function DeleteButton({ clientId, clientName, onSuccess }: DeleteButtonProps) {
  const showConfirmDialog = () => {
    console.log('DeleteButton: Mostrando diálogo de confirmação');
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir o cliente "${clientName}"?`,
      [
        { 
          text: 'Cancelar', 
          style: 'cancel',
          onPress: () => console.log('DeleteButton: Exclusão cancelada')
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: handleDelete,
        },
      ],
      { cancelable: true }
    );
  };

  const handleDelete = async () => {
    console.log('DeleteButton: Iniciando exclusão do cliente:', clientId);
    try {
      await clientApi.deleteClient(clientId);
      console.log('DeleteButton: Cliente excluído com sucesso');
      Alert.alert('Sucesso', 'Cliente excluído com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            console.log('DeleteButton: Chamando callback de sucesso');
            onSuccess();
          }
        }
      ]);
    } catch (error) {
      console.error('DeleteButton: Erro ao excluir:', error);
      Alert.alert('Erro', 'Não foi possível excluir o cliente. Tente novamente.');
    }
  };

  return (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={showConfirmDialog}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>Excluir</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: colors.button.danger,
  },
  buttonText: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
}); 