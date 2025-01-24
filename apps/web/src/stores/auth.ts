import { defineStore } from 'pinia'
import api from '@/lib/axios'

type User = {
  id: string
  name: string
  email: string
  phone: string
  cnpj: string | null
  cep: string | null
  state: string | null
  city: string | null
  neighborhood: string | null
  address: string | null
  number: string | null
  complement: string | null
  latitude: number | null
  longitude: number | null
  emailVerified: boolean
  verificationCode: string | null
  verificationCodeExpiresAt: Date | null
  createdAt: Date
  updatedAt: Date
}

interface AuthResponse {
  access_token: string
  user: User
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  initialized: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    loading: false,
    initialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isRegistrationComplete: (state) => !!(state.user?.cep && state.user?.address),
    isEmailVerified: (state) => !!state.user?.emailVerified,
    hasLocation: (state) => !!(state.user?.latitude && state.user?.longitude)
  },

  actions: {
    async checkAuth() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.initialized = true;
        return;
      }

      if (!this.initialized) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      try {
        this.loading = true;
        const response = await api.get<AuthResponse>('/auth/me');
        this.setUser(response.data.user);
        this.setToken(response.data.access_token);
      } catch (error) {
        this.logout();
      } finally {
        this.loading = false;
        this.initialized = true;
      }
    },

    setUser(user: User) {
      this.user = user
    },

    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },

    logout() {
      this.user = null
      this.token = null
      this.initialized = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      api.defaults.headers.common['Authorization'] = ''
    }
  }
})
