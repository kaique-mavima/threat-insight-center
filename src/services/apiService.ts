
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface ApiConfig {
  userId: string;
  configType: 'jira' | 'google_sheets' | 'google_maps' | 'slack' | 'teams' | 'telegram' | 'smtp';
  config: any;
}

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('auth_token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log(`API Request: ${options.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth APIs
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  }

  async logout() {
    localStorage.removeItem('auth_token');
    await this.request('/auth/logout', { method: 'POST' });
  }

  // User APIs
  async getUsers(): Promise<ApiUser[]> {
    return await this.request('/users');
  }

  async createUser(userData: Omit<ApiUser, 'id' | 'createdAt'>): Promise<ApiUser> {
    return await this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: string, userData: Partial<ApiUser>): Promise<ApiUser> {
    return await this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: string): Promise<void> {
    await this.request(`/users/${userId}`, { method: 'DELETE' });
  }

  // Config APIs
  async getConfigs(configType?: string): Promise<ApiConfig[]> {
    const endpoint = configType ? `/configs?type=${configType}` : '/configs';
    return await this.request(endpoint);
  }

  async saveConfig(configType: string, config: any): Promise<ApiConfig> {
    return await this.request('/configs', {
      method: 'POST',
      body: JSON.stringify({ configType, config }),
    });
  }

  async updateConfig(configId: string, config: any): Promise<ApiConfig> {
    return await this.request(`/configs/${configId}`, {
      method: 'PUT',
      body: JSON.stringify({ config }),
    });
  }

  async deleteConfig(configId: string): Promise<void> {
    await this.request(`/configs/${configId}`, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();
