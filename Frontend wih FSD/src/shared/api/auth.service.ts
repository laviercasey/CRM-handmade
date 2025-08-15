import api from './index';

interface UserData {
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
  password?: string;
  [key: string]: any;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: UserData;
}

class AuthService {
  async register(userData: UserData) {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  }
  
  async login(credentials: LoginCredentials) {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }
  
  async refreshToken(refreshToken: string) {
    const response = await api.post<{ access_token: string }>('/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  }
  
  async getCurrentUser() {
    const response = await api.get<UserData>('/users/me');
    return response.data;
  }
  
  async updateUser(userData: UserData) {
    const response = await api.patch<UserData>('/users/me', userData);
    return response.data;
  }
  
  async changePassword(passwordData: PasswordData) {
    const response = await api.post('/users/me/change-password', {
      current_password: passwordData.currentPassword,
      new_password: passwordData.newPassword
    });
    return response.data;
  }

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  }
  
  async requestPasswordReset(email: string) {
    const response = await api.post('/auth/password-reset-request', { email });
    return response.data;
  }
  
  async resetPassword(token: string, newPassword: string) {
    const response = await api.post('/auth/password-reset', {
      token,
      new_password: newPassword
    });
    return response.data;
  }
  
  async deleteAccount() {
    const response = await api.delete('/users/me');
    return response.data;
  }
}

export default new AuthService();