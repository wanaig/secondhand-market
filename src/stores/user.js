import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const USERS_KEY = 'glean_users'
const CURRENT_USER_KEY = 'glean_current_user'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null'))
  const showLogin = ref(false)
  const showRegister = ref(false)

  const isLoggedIn = computed(() => !!currentUser.value)
  const username = computed(() => currentUser.value?.username || '')
  const avatar = computed(() => currentUser.value?.avatar || '')
  const userId = computed(() => currentUser.value?.id || '')

  function ensureSeedUser() {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    if (users.length === 0) {
      const seeds = [
        { id: 'u_seed_1', username: 'admin', password: '123456', nickname: '拾光君', campus: '中心校区', avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=admin', createTime: '2026-01-01T00:00:00Z' },
        { id: 'u_seed_2', username: 'demo', password: '123456', nickname: '小拾', campus: '东校区', avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=demo', createTime: '2026-01-02T00:00:00Z' }
      ]
      localStorage.setItem(USERS_KEY, JSON.stringify(seeds))
    }
  }

  function login(usernameInput, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
        const user = users.find(u => u.username === usernameInput && u.password === password)
        if (!user) return reject(new Error('用户名或密码错误'))
        currentUser.value = user
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
        showLogin.value = false
        resolve(user)
      }, 400)
    })
  }

  function register(form) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
        if (users.find(u => u.username === form.username)) {
          return reject(new Error('用户名已存在'))
        }
        const user = {
          id: 'u_' + Date.now(),
          username: form.username,
          password: form.password,
          nickname: form.nickname || form.username,
          avatar: `https://api.dicebear.com/7.x/lorelei/svg?seed=${form.username}`,
          campus: form.campus || '中心校区',
          phone: form.phone || '',
          createTime: new Date().toISOString()
        }
        users.push(user)
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
        currentUser.value = user
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
        showRegister.value = false
        resolve(user)
      }, 400)
    })
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem(CURRENT_USER_KEY)
  }

  function openLoginDialog() {
    showLogin.value = true
    showRegister.value = false
  }

  function openRegisterDialog() {
    showRegister.value = true
    showLogin.value = false
  }

  function closeDialogs() {
    showLogin.value = false
    showRegister.value = false
  }

  function updateProfile(payload) {
    if (!currentUser.value) return
    currentUser.value = { ...currentUser.value, ...payload }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser.value))
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    const idx = users.findIndex(u => u.id === currentUser.value.id)
    if (idx > -1) {
      users[idx] = { ...users[idx], ...payload }
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }
  }

  return {
    currentUser, showLogin, showRegister,
    isLoggedIn, username, avatar, userId,
    ensureSeedUser, login, register, logout,
    openLoginDialog, openRegisterDialog, closeDialogs, updateProfile
  }
})
