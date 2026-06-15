import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const KEY = 'glean_messages'

const seedMessages = [
  {
    id: 'm1',
    type: 'comment',
    title: '小白 给你的商品留言了',
    content: '同学你好，请问那本《算法导论》还在吗？',
    time: '刚刚',
    read: false,
    link: '/profile/publish'
  },
  {
    id: 'm2',
    type: 'favorite',
    title: '咖啡橙 收藏了你的商品',
    content: '《宿舍迷你咖啡机 几乎没用过》被收藏',
    time: '4 小时前',
    read: false,
    link: '/profile/publish'
  },
  {
    id: 'm3',
    type: 'system',
    title: '欢迎来到拾光集',
    content: '欢迎加入 GleanCampus 校园二手交易平台，开启你的好物交换之旅。',
    time: '1 天前',
    read: false
  },
  {
    id: 'm4',
    type: 'system',
    title: '安全交易小贴士',
    content: '建议同学之间面交，注意保护个人信息和财产安全。',
    time: '2 天前',
    read: true
  }
]

export const useMessageStore = defineStore('message', () => {
  const list = ref(JSON.parse(localStorage.getItem(KEY) || 'null') || seedMessages)

  const unreadCount = computed(() => list.value.filter(m => !m.read).length)

  function markRead(id) {
    const m = list.value.find(x => x.id === id)
    if (m) { m.read = true; persist() }
  }

  function markAllRead() {
    list.value = list.value.map(m => ({ ...m, read: true }))
    persist()
  }

  function clearAll() {
    list.value = []
    persist()
  }

  function add(msg) {
    list.value.unshift({
      id: 'm_' + Date.now(),
      time: '刚刚',
      read: false,
      ...msg
    })
    persist()
  }

  function persist() {
    localStorage.setItem(KEY, JSON.stringify(list.value))
  }

  return { list, unreadCount, markRead, markAllRead, clearAll, add }
})
