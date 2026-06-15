import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const KEY = 'glean_cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem(KEY) || '[]'))

  const count = computed(() => items.value.length)
  const totalPrice = computed(() => items.value.reduce((s, i) => s + i.price, 0))

  function isInCart(id) {
    return items.value.some(i => i.id === id)
  }

  function addItem(item) {
    if (isInCart(item.id)) return
    items.value.push({
      id: item.id,
      title: item.title,
      price: item.price,
      cover: item.cover,
      condition: item.condition,
      categoryName: item.categoryName,
      sellerName: item.sellerName,
      sellerAvatar: item.sellerAvatar,
      addedAt: Date.now()
    })
    persist()
  }

  function removeItem(id) {
    items.value = items.value.filter(i => i.id !== id)
    persist()
  }

  function clear() {
    items.value = []
    persist()
  }

  function persist() {
    localStorage.setItem(KEY, JSON.stringify(items.value))
  }

  return { items, count, totalPrice, isInCart, addItem, removeItem, clear }
})
