const TOKEN_KEY = 'glean_token'
const USER_KEY = 'glean_user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function getLocalUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}

export function setLocalUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function removeLocalUser() {
  localStorage.removeItem(USER_KEY)
}
