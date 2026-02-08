import { defineStore } from 'pinia'
import { postResponseWithoutAuth } from 'src/services/api'

export const useAuth = defineStore('auth', {
  state: () => ({
    token: null,
    refreshToken: null,
    role: null,
    tokenType: null,
    loaded: false,
    loading: false
  }),

  persist: {
    omit: ['loading', 'loaded'],
  },

  getters: {
    isAuthenticated: (state) => {
      return !!state.loaded
    },
    returnTokenForHeader: (state) => {
      return state.tokenType + ' ' + state.token
    }
  },

  actions: {
    async login(username, password) {
      if (this.loaded || this.loading) return

      this.loading = true
      try {
        const data = await postResponseWithoutAuth('/auth/login', {
          'login': username,
          'password': password
        })

        this.token = data.access_token
        this.refreshToken = data.refresh_token
        this.role = data.role
        this.tokenType = data.token_type
        this.loaded = true
        window.user = username

      } catch(err) {
        console.error('Login failed', err)
        const error = new Error(err.message)
        error.statusCode = err.statusCode
        throw error

      } finally {
        this.loading = false
      }
    },

    async refresh() {
      if (!this.loaded || this.loading) return

      this.loading = true
      try {
        const data = await postResponseWithoutAuth('/auth/refresh', {
          'refresh_token': this.refreshToken,
        })
        this.token = data.access_token

      } catch(err) {
        console.error('Refresh failed', err)
        const error = new Error(err.message)
        error.statusCode = err.statusCode
        throw error

      } finally {
        this.loading = false
      }
    },

    async logout() {
      if (!this.loaded || this.loading) return

      this.loading = true
      try {
        await postResponseWithoutAuth('/auth/logout', {
          'refresh_token': this.refreshToken,
        })
        this.token = null
        this.refreshToken = null
        this.role = null
        this.tokenType = null
        this.loaded = false
        window.user = null

      } catch(err) {
        console.error('Logout failed', err)
        const error = new Error(err.message)
        error.statusCode = err.statusCode
        throw error

      } finally {
        this.loading = false
      }
    },
  },
})

