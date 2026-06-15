export const storage = {
  get(key, defaultValue = null) {
    try {
      const v = localStorage.getItem(key)
      return v ? JSON.parse(v) : defaultValue
    } catch (_) {
      return defaultValue
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove(key) {
    localStorage.removeItem(key)
  }
}
