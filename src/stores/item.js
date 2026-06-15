import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getItems } from '@/api/item'
import { useUserStore } from './user'

export const useItemStore = defineStore('item', () => {
  const myPublished = ref([])
  const loading = ref(false)

  async function fetchMyPublished() {
    const userStore = useUserStore()
    if (!userStore.isLoggedIn) {
      myPublished.value = []
      return
    }
    loading.value = true
    try {
      const res = await getItems({ size: 50 })
      myPublished.value = res.data.list.filter(i => i.sellerId === userStore.userId)
    } finally {
      loading.value = false
    }
  }

  return { myPublished, loading, fetchMyPublished }
})
