import { Client, ClientCreateInput, ClientUpdateInput } from '../types/Client';
import { authenticatedFetch } from './api';

export const clientApi = {
  async listClients(): Promise<Client[]> {
    console.log('Iniciando listagem de clientes...');
    const response = await authenticatedFetch('/clientes');
    
    if (!response.ok) {
      console.error('Erro ao listar clientes:', response.status, response.statusText);
      const errorData = await response.json().catch(() => ({}));
      console.error('Detalhes do erro:', errorData);
      throw new Error('Failed to fetch clients');
    }

    const data = await response.json();
    console.log('Dados recebidos:', data);
    return data;
  },

  async createClient(data: ClientCreateInput): Promise<Client> {
    console.log('Iniciando criação de cliente:', data);
    const formData = new FormData();
    
    // Adiciona os campos básicos
    formData.append('nome', data.nome);
    formData.append('endereco', data.endereco);
    if (data.telefone) formData.append('telefone', data.telefone);
    if (data.latitude) formData.append('latitude', data.latitude.toString());
    if (data.longitude) formData.append('longitude', data.longitude.toString());

    // Adiciona a foto se existir
    if (data.foto) {
      console.log('Anexando foto:', data.foto);
      // Criando um Blob a partir do arquivo
      const response = await fetch(data.foto.uri);
      const blob = await response.blob();
      
      formData.append('foto', blob, data.foto.name || 'photo.jpg');
    }

    console.log('FormData preparado');

    const response = await authenticatedFetch('/clientes', {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Erro ao criar cliente:', response.status, response.statusText);
      const errorData = await response.json().catch(() => ({}));
      console.error('Detalhes do erro:', errorData);
      throw new Error(errorData.error || 'Failed to create client');
    }
    return response.json();
  },

  async updateClient(data: ClientUpdateInput): Promise<Client> {
    console.log('Iniciando atualização de cliente:', data);
    
    // Se não houver foto, enviar como JSON
    if (!data.foto) {
      const response = await authenticatedFetch(`/clientes/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          nome: data.nome,
          telefone: data.telefone || null,
          endereco: data.endereco,
          latitude: data.latitude || null,
          longitude: data.longitude || null,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update client');
      }
      return response.json();
    }

    // Se houver foto, enviar como FormData
    const formData = new FormData();
    
    formData.append('nome', data.nome || '');
    formData.append('endereco', data.endereco || '');
    if (data.telefone) formData.append('telefone', data.telefone);
    if (data.latitude) formData.append('latitude', data.latitude.toString());
    if (data.longitude) formData.append('longitude', data.longitude.toString());

    // Criando um Blob a partir do arquivo
    const response = await fetch(data.foto.uri);
    const blob = await response.blob();
    formData.append('foto', blob, data.foto.name || 'photo.jpg');

    console.log('FormData preparado para atualização');

    const updateResponse = await authenticatedFetch(`/clientes/${data.id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!updateResponse.ok) {
      console.error('Erro ao atualizar cliente:', updateResponse.status, updateResponse.statusText);
      const errorData = await updateResponse.json().catch(() => ({}));
      console.error('Detalhes do erro:', errorData);
      throw new Error(errorData.error || 'Failed to update client');
    }
    return updateResponse.json();
  },

  async deleteClient(id: number): Promise<void> {
    console.log('Iniciando exclusão do cliente:', id);
    const response = await authenticatedFetch(`/clientes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.error('Erro ao excluir cliente:', response.status, response.statusText);
      const errorData = await response.json().catch(() => ({}));
      console.error('Detalhes do erro:', errorData);
      throw new Error(errorData.error || 'Failed to delete client');
    }
  },

  async getClientById(id: number): Promise<Client> {
    const response = await authenticatedFetch(`/clientes/${id}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch client');
    }
    return response.json();
  },
}; 