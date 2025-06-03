import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'react-native-image-picker';
import { Client, ClientCreateInput, ClientUpdateInput } from '../types/Client';
import { colors } from '../theme/colors';

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: ClientCreateInput | ClientUpdateInput) => Promise<void>;
  isLoading: boolean;
}

export default function ClientForm({ initialData, onSubmit, isLoading }: ClientFormProps) {
  const [nome, setNome] = useState(initialData?.nome || '');
  const [telefone, setTelefone] = useState(initialData?.telefone || '');
  const [endereco, setEndereco] = useState(initialData?.endereco || '');
  const [latitude, setLatitude] = useState(initialData?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(initialData?.longitude?.toString() || '');
  const [foto, setFoto] = useState<{
    uri: string;
    type: string;
    name: string;
  } | null>(
    initialData?.foto_caminho
      ? {
          uri: initialData.foto_caminho,
          type: 'image/jpeg',
          name: 'current_photo.jpg',
        }
      : null
  );

  const handleSelectImage = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 800,
        maxWidth: 800,
      },
      (response) => {
        if (response.didCancel) {
          return;
        }

        if (response.errorCode) {
          Alert.alert('Erro', 'Erro ao selecionar imagem');
          return;
        }

        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          setFoto({
            uri: asset.uri!,
            type: asset.type!,
            name: asset.fileName || 'photo.jpg',
          });
        }
      }
    );
  };

  const handleSubmit = async () => {
    if (!nome.trim() || !endereco.trim()) {
      Alert.alert('Erro', 'Nome e endereço são obrigatórios');
      return;
    }

    try {
      const formData: ClientCreateInput | ClientUpdateInput = {
        nome: nome.trim(),
        endereco: endereco.trim(),
        telefone: telefone.trim() || undefined,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        foto: foto || undefined,
      };

      if (initialData) {
        (formData as ClientUpdateInput).id = initialData.id;
      }

      await onSubmit(formData);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o cliente');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageContainer} onPress={handleSelectImage}>
        {foto ? (
          <Image source={{ uri: foto.uri }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="camera" size={40} color={colors.primary} />
            <Text style={styles.placeholderText}>Adicionar foto</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome*</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome do cliente"
            placeholderTextColor={colors.text.secondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="(00) 00000-0000"
            placeholderTextColor={colors.text.secondary}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Endereço*</Text>
          <TextInput
            style={styles.input}
            value={endereco}
            onChangeText={setEndereco}
            placeholder="Endereço completo"
            placeholderTextColor={colors.text.secondary}
            multiline
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>Latitude</Text>
            <TextInput
              style={styles.input}
              value={latitude}
              onChangeText={setLatitude}
              placeholder="Ex: -23.550520"
              placeholderTextColor={colors.text.secondary}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>Longitude</Text>
            <TextInput
              style={styles.input}
              value={longitude}
              onChangeText={setLongitude}
              placeholder="Ex: -46.633308"
              placeholderTextColor={colors.text.secondary}
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Salvando...' : initialData ? 'Atualizar' : 'Cadastrar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background.dark,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.background.light,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 8,
    color: colors.text.secondary,
    fontSize: 14,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: colors.text.secondary,
  },
  input: {
    backgroundColor: colors.background.input,
    borderRadius: 8,
    padding: 12,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.background.input,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -8,
  },
  halfWidth: {
    flex: 1,
    marginHorizontal: 8,
  },
  submitButton: {
    backgroundColor: colors.button.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 