export interface Client {
  id: number;
  nome: string;
  telefone: string | null;
  endereco: string;
  latitude: number | null;
  longitude: number | null;
  foto_caminho: string | null;
  data_cadastro: string;
}

export interface ClientCreateInput {
  nome: string;
  telefone?: string;
  endereco: string;
  latitude?: number;
  longitude?: number;
  foto?: {
    uri: string;
    type: string;
    name: string;
  };
}

export interface ClientUpdateInput extends Partial<ClientCreateInput> {
  id: number;
} 