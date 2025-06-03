import AsyncStorage from '@react-native-async-storage/async-storage';

// URL da API
const API_URL = 'http://localhost:3000';

interface LoginData {
  username: string;
  senha: string;
}

interface RegisterData {
  username: string;
  email: string;
  senha: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export const login = async (credentials: LoginData): Promise<ApiResponse<{ token: string }>> => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem('userToken', data.token);
      return { data };
    } else {
      return { error: data.error || 'Login failed' };
    }
  } catch (error) {
    return { error: 'Network error. Please try again.' };
  }
};

export const register = async (userData: RegisterData): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      return { data: undefined };
    } else {
      return { error: data.error || 'Registration failed' };
    }
  } catch (error) {
    return { error: 'Network error. Please try again.' };
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('userToken');
};

export const removeAuthToken = async (): Promise<void> => {
  await AsyncStorage.removeItem('userToken');
};

export const authenticatedFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = await AsyncStorage.getItem('userToken');
  console.log('authenticatedFetch: Endpoint:', endpoint);
  console.log('authenticatedFetch: Method:', options.method || 'GET');
  
  if (!token) {
    console.error('authenticatedFetch: No authentication token found');
    throw new Error('No authentication token found');
  }

  console.log('authenticatedFetch: Token encontrado');

  const defaultHeaders = {
    'Authorization': `Bearer ${token}`,
  };

  // Se não for FormData, adiciona o Content-Type JSON
  if (!options.body || !(options.body instanceof FormData)) {
    Object.assign(defaultHeaders, {
      'Content-Type': 'application/json',
    });
  }

  const finalUrl = `${API_URL}${endpoint}`;
  console.log('authenticatedFetch: URL final:', finalUrl);

  try {
    console.log('authenticatedFetch: Iniciando requisição com headers:', {
      ...defaultHeaders,
      ...options.headers,
    });

    const response = await fetch(finalUrl, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    // Log para debug
    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        method: options.method || 'GET',
      });
      try {
        const errorData = await response.json();
        console.error('Error response:', errorData);
      } catch (e) {
        console.error('Could not parse error response');
      }
    } else {
      console.log('authenticatedFetch: Requisição bem-sucedida');
    }

    return response;
  } catch (error) {
    console.error('Network error:', error);
    throw new Error('Network error. Please check your connection.');
  }
};

export const setAuthToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem('userToken', token);
}; 