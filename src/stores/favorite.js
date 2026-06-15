import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const KEY = 'glean_favorites'

export const useFavoriteStore = defineStore('favorite', () => {
  const list = ref(JSON.parse(localStorage.getItem(KEY) || '[]'))

  const count = computed(() => list.value.length)

  function isFavorite(id) {
    return list.value.some(i => i.id === id)
  }

  function toggleFavorite(item) {
    if (isFavorite(item.id)) {
      list.value = list.value.filter(i => i.id !== item.id)
    } else {
      list.value.unshift({ ...item, favoritedAt: Date.now() })
    }
    persist()
  }

  function clear() {
    list.value = []
    persist()
  }

  function persist() {
    localStorage.setItem(KEY, JSON.stringify(list.value))
  }

  return { list, count, isFavorite, toggleFavorite, clear }
})
