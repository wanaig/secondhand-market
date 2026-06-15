import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const KEY = 'glean_chats'

// 模拟自动回复
const autoReplies = [
  '你好，这件还在的~',
  '可以的，什么时间方便看？',
  '价格还能小刀吗？',
  '我在东校区，方便面交',
  '嗯嗯，明天下午可以哦',
  '好的，那就说定了',
  '稍等我看一下哈',
  '可以走闲鱼，更安全',
  '没问题，随时可以来取',
  '成色非常好，几乎没用过'
]

export const useChatStore = defineStore('chat', () => {
  const conversations = ref(JSON.parse(localStorage.getItem(KEY) || '[]'))

  const unreadTotal = computed(() =>
    conversations.value.reduce((s, c) => s + c.messages.filter(m => !m.read && !m.isMine).length, 0)
  )

  function getMyConversations(myId) {
    return conversations.value
      .filter(c => c.myId === myId)
      .sort((a, b) => new Date(b.lastTime || 0) - new Date(a.lastTime || 0))
  }

  function getConversationById(id) {
    return conversations.value.find(c => c.id === id)
  }

  function findConversation(myId, otherId, itemId) {
    return conversations.value.find(c =>
      c.myId === myId && c.otherUser.id === otherId && c.itemId === itemId
    )
  }

  function createOrGetConversation(myUser, otherUser, item) {
    let conv = findConversation(myUser.id, otherUser.id, item.id)
    if (!conv) {
      conv = {
        id: 'conv_' + Date.now() + Math.random().toString(36).slice(2, 6),
        myId: myUser.id,
        myName: myUser.nickname,
        myAvatar: myUser.avatar,
        otherUser: {
          id: otherUser.id,
          nickname: otherUser.nickname || otherUser.name,
          avatar: otherUser.avatar,
          campus: otherUser.campus || ''
        },
        itemId: item.id,
        itemTitle: item.title,
        itemCover: item.cover,
        itemPrice: item.price,
        messages: [],
        lastMessage: '',
        lastTime: new Date().toLocaleString('zh-CN'),
        createdAt: Date.now()
      }
      conversations.value.unshift(conv)
      persist()
    }
    return conv
  }

  function sendMessage(convId, content, isMine = true) {
    const conv = conversations.value.find(c => c.id === convId)
    if (!conv) return null
    const msg = {
      id: 'msg_' + Date.now() + Math.random().toString(36).slice(2, 5),
      content,
      isMine,
      time: new Date().toLocaleString('zh-CN'),
      read: isMine
    }
    conv.messages.push(msg)
    conv.lastMessage = content
    conv.lastTime = msg.time
    persist()
    return msg
  }

  function simulateReply(convId) {
    const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)]
    setTimeout(() => sendMessage(convId, reply, false), 800 + Math.random() * 1500)
  }

  function markConversationRead(convId) {
    const conv = conversations.value.find(c => c.id === convId)
    if (conv) {
      conv.messages.forEach(m => { m.read = true })
      persist()
    }
  }

  function deleteConversation(convId) {
    conversations.value = conversations.value.filter(c => c.id !== convId)
    persist()
  }

  function persist() {
    localStorage.setItem(KEY, JSON.stringify(conversations.value))
  }

  return {
    conversations, unreadTotal,
    getMyConversations, getConversationById, findConversation,
    createOrGetConversation, sendMessage, simulateReply,
    markConversationRead, deleteConversation
  }
})
