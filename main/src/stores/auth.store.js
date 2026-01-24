import { defineStore } from 'pinia'

export const useAuth = defineStore('auth', {
  state: () => ({
    token: null,
    login: null,
    role: null,
    _initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => {
      return !!state.token
    },
  },

  actions: {
    login(token, login, role = null) {
      this.token = token
      this.login = login
      this.role = role
    },

    logout() {
      this.token = null
      this.login = null
      this.role = null
    },
  },
})

