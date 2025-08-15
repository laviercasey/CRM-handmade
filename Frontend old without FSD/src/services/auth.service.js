import api from './api'

class AuthService {
  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  }
  
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response.data
  }
  
  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken })
    return response.data
  }
  
  async getCurrentUser() {
    const response = await api.get('/users/me')
    return response.data
  }
  
  async updateUser(userData) {
    const response = await api.patch('/users/me', userData)
    return response.data
  }

async changePassword(passwordData) {
  const response = await api.post('/users/me/change-password', {
    current_password: passwordData.currentPassword,
    new_password: passwordData.newPassword
  });
  return response.data;
}

  async uploadAvatar(file) {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await api.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  }
  
  async requestPasswordReset(email) {
    const response = await api.post('/auth/password-reset-request', { email })
    return response.data
  }
  
  async resetPassword(token, newPassword) {
    const response = await api.post('/auth/password-reset', {
      token,
      new_password: newPassword
    })
    return response.data
  }
  
  async deleteAccount() {
    const response = await api.delete('/users/me')
    return response.data
  }
}

export default new AuthService()
