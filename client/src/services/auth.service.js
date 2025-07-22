import api from './api';

class AuthError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

const authService = {
  // Store tokens and user data
  setAuthData: (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('tokenExpiry', new Date(data.tokenExpiry).getTime());
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  },

  // Clear auth data
  clearAuthData: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    delete api.defaults.headers.common['Authorization'];
  },

  // Check if token needs refresh
  shouldRefreshToken: () => {
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    if (!tokenExpiry) return false;
    return Date.now() + TOKEN_REFRESH_THRESHOLD > parseInt(tokenExpiry);
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new AuthError('No refresh token available', 401);
      }

      const response = await api.post('/auth/refresh-token', { refreshToken });
      if (response.data.success) {
        authService.setAuthData(response.data);
        return response.data;
      }
      throw new AuthError('Failed to refresh token', response.status);
    } catch (error) {
      authService.clearAuthData();
      throw new AuthError(
        error.response?.data?.message || 'Token refresh failed',
        error.response?.status || 500
      );
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        authService.setAuthData(response.data);
        return response.data;
      }
      throw new AuthError(response.data.message || 'Registration failed', response.status);
    } catch (error) {
      throw new AuthError(
        error.response?.data?.message || 'Registration failed',
        error.response?.status || 500
      );
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success) {
        authService.setAuthData(response.data);
        return response.data;
      }
      throw new AuthError(response.data.message || 'Login failed', response.status);
    } catch (error) {
      throw new AuthError(
        error.response?.data?.message || 'Invalid credentials',
        error.response?.status || 500
      );
    }
  },

  // Logout user
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authService.clearAuthData();
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      if (authService.shouldRefreshToken()) {
        await authService.refreshToken();
      }
      const response = await api.get('/auth/me');
      if (response.data.success) {
        const currentUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(currentUser));
        return currentUser;
      }
      throw new AuthError(response.data.message || 'Failed to get user data', response.status);
    } catch (error) {
      if (error.response?.status === 401) {
        authService.clearAuthData();
      }
      throw new AuthError(
        error.response?.data?.message || 'Failed to get user data',
        error.response?.status || 500
      );
    }
  },

  // Get stored user from localStorage
  getStoredUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    return token && tokenExpiry && Date.now() < parseInt(tokenExpiry);
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      if (response.data.success) {
        return response.data;
      }
      throw new AuthError(response.data.message || 'Failed to send reset email', response.status);
    } catch (error) {
      throw new AuthError(
        error.response?.data?.message || 'Failed to send reset email',
        error.response?.status || 500
      );
    }
  },

  // Reset password
  resetPassword: async (token, password) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { password });
      if (response.data.success) {
        authService.setAuthData(response.data);
        return response.data;
      }
      throw new AuthError(response.data.message || 'Password reset failed', response.status);
    } catch (error) {
      throw new AuthError(
        error.response?.data?.message || 'Password reset failed',
        error.response?.status || 500
      );
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      if (authService.shouldRefreshToken()) {
        await authService.refreshToken();
      }
      const response = await api.put('/auth/update-profile', userData);
      if (response.data.success) {
        const updatedUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      throw new AuthError(response.data.message || 'Failed to update profile', response.status);
    } catch (error) {
      throw new AuthError(
        error.response?.data?.message || 'Failed to update profile',
        error.response?.status || 500
      );
    }
  }
};

export default authService; 