import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loggedIn: false as boolean,
    userName: null as string | null
  }),
  actions: {
    login(name?: string) {
      this.loggedIn = true
      this.userName = name ?? 'Guest'
    },
    logout() {
      this.loggedIn = false
      this.userName = null
    }
  }
})
