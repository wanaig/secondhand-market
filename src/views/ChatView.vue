<template>
  <div class="chat-view">
    <div class="chat-view__container">
      <!-- 侧边栏：对话列表 -->
      <aside class="chat-sidebar">
        <div class="chat-sidebar__head">
          <h2>私信</h2>
          <router-link to="/profile/chats" class="chat-sidebar__back">← 返回全部</router-link>
        </div>
        <div class="chat-sidebar__list">
          <router-link
            v-for="conv in conversations"
            :key="conv.id"
            :to="`/chat/${conv.id}`"
            class="chat-sidebar__item"
            :class="{ 'chat-sidebar__item--active': conv.id === currentConvId }"
            @click="chatStore.markConversationRead(conv.id)"
          >
            <img :src="conv.otherUser.avatar" :alt="conv.otherUser.nickname" />
            <div class="chat-sidebar__item-info">
              <h4>{{ conv.otherUser.nickname }}</h4>
              <p>{{ conv.lastMessage || '暂无消息' }}</p>
            </div>
            <span class="chat-sidebar__item-time">{{ formatShort(conv.lastTime) }}</span>
          </router-link>
        </div>
      </aside>

      <!-- 主聊天区 -->
      <main class="chat-main">
        <div v-if="conv" class="chat-main__inner">
          <!-- 顶部 -->
          <div class="chat-header">
            <router-link to="/profile/chats" class="chat-header__back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 18 9 12l6-6"/></svg>
            </router-link>
            <img :src="conv.otherUser.avatar" :alt="conv.otherUser.nickname" />
            <div class="chat-header__info">
              <h3>{{ conv.otherUser.nickname }}</h3>
              <span>{{ conv.otherUser.campus }}</span>
            </div>
            <div class="chat-header__item">
              <img :src="conv.itemCover" alt="" />
              <div>
                <span class="chat-header__item-title">{{ conv.itemTitle }}</span>
                <strong class="chat-header__item-price">¥{{ conv.itemPrice }}</strong>
              </div>
            </div>
          </div>

          <!-- 消息列表 -->
          <div class="chat-messages" ref="messagesRef">
            <div class="chat-messages__date">今天</div>
            <div
              v-for="msg in conv.messages"
              :key="msg.id"
              class="chat-msg"
              :class="{ 'chat-msg--mine': msg.isMine }"
            >
              <img
                v-if="!msg.isMine"
                :src="conv.otherUser.avatar"
                :alt="conv.otherUser.nickname"
                class="chat-msg__avatar"
              />
              <div class="chat-msg__bubble">
                <p>{{ msg.content }}</p>
                <span class="chat-msg__time">{{ formatTime(msg.time) }}</span>
              </div>
              <img
                v-if="msg.isMine"
                :src="userStore.avatar"
                :alt="userStore.username"
                class="chat-msg__avatar"
              />
            </div>
            <div v-if="!conv.messages.length" class="chat-messages__empty">
              <p>还没有消息，发送第一条吧！</p>
            </div>
          </div>

          <!-- 快捷回复 -->
          <div class="chat-quick">
            <button
              v-for="q in quickReplies"
              :key="q"
              class="chat-quick__btn"
              @click="sendQuick(q)"
            >{{ q }}</button>
          </div>

          <!-- 输入区 -->
          <div class="chat-input">
            <input
              v-model="newMsg"
              type="text"
              placeholder="输入消息..."
              @keyup.enter="send"
              class="chat-input__field"
            />
            <button class="chat-input__send" @click="send" :disabled="!newMsg.trim()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </div>

        <EmptyState v-else title="对话不存在" desc="可能已被删除" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import EmptyState from '@/components/EmptyState.vue'
import dayjs from 'dayjs'

const route = useRoute()
const chatStore = useChatStore()
const userStore = useUserStore()

const messagesRef = ref(null)
const newMsg = ref('')

const currentConvId = computed(() => route.params.id)
const conv = computed(() => chatStore.getConversationById(currentConvId.value))
const conversations = computed(() => chatStore.getMyConversations(userStore.userId))

const quickReplies = [
  '你好，请问还在吗？',
  '方便面交吗？',
  '价格还能优惠吗？',
  '明天下午可以吗？',
  '好的，谢谢！'
]

function send() {
  const content = newMsg.value.trim()
  if (!content || !conv.value) return
  chatStore.sendMessage(conv.value.id, content, true)
  newMsg.value = ''
  scrollToBottom()
  chatStore.simulateReply(conv.value.id)
  setTimeout(scrollToBottom, 2500)
}

function sendQuick(q) {
  newMsg.value = q
  send()
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

function formatTime(time) {
  if (!time) return ''
  try {
    return dayjs(new Date(time)).format('HH:mm')
  } catch {
    return time
  }
}

function formatShort(time) {
  if (!time) return ''
  try {
    const d = dayjs(new Date(time))
    const now = dayjs()
    if (d.isSame(now, 'day')) return d.format('HH:mm')
    if (d.isSame(now.subtract(1, 'day'), 'day')) return '昨天'
    return d.format('MM/DD')
  } catch {
    return ''
  }
}

watch(currentConvId, () => {
  if (conv.value) {
    chatStore.markConversationRead(conv.value.id)
    scrollToBottom()
  }
}, { immediate: true })

onMounted(scrollToBottom)
</script>

<style lang="scss" scoped>
.chat-view {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 32px 0;
  height: calc(100vh - 80px - 80px);
  min-height: 0;

  &__container {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 0;
    height: 100%;
    border-radius: $radius-xl;
    overflow: hidden;
    background: $cream-50;
    box-shadow: $shadow-medium;
    border: 1px solid rgba(20, 32, 26, 0.06);
    min-height: 0;
  }
}

// —— 侧边栏 ——
.chat-sidebar {
  background: $cream-100;
  border-right: 1px solid $cream-300;
  display: flex;
  flex-direction: column;

  &__head {
    padding: 20px 18px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid $cream-300;

    h2 {
      font-family: $font-display;
      font-size: 20px;
      color: $ink-900;
    }
  }

  &__back {
    font-size: 11px;
    color: $ink-400;
    transition: color .3s;
    &:hover { color: $accent-caramel; }
  }

  &__list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: $radius-md;
    transition: all .3s $ease-soft;
    color: inherit;

    img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: $cream-300;
      object-fit: cover;
      flex-shrink: 0;
    }

    &-info {
      flex: 1;
      min-width: 0;

      h4 {
        font-size: 13px;
        font-weight: 600;
        color: $ink-900;
        margin-bottom: 2px;
      }

      p {
        font-size: 11px;
        color: $ink-400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    &-time {
      font-size: 10px;
      color: $ink-300;
      font-family: $font-mono;
      flex-shrink: 0;
    }

    &--active {
      background: $cream-200;
    }

    &:hover:not(&--active) {
      background: $cream-200;
    }
  }
}

// —— 主聊天区 ——
.chat-main {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;

  &__inner {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 24px;
  border-bottom: 1px solid $cream-300;
  background: $cream-50;
  flex-shrink: 0;

  &__back {
    display: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: $cream-200;
    align-items: center;
    justify-content: center;
    color: $ink-800;

    svg { width: 16px; height: 16px; }
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: $cream-300;
    object-fit: cover;
  }

  &__info {
    flex: 1;

    h3 {
      font-size: 15px;
      font-weight: 600;
      color: $ink-900;
      margin-bottom: 2px;
    }
    span {
      font-size: 11px;
      color: $ink-400;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: $radius-pill;
    background: $cream-100;

    img {
      width: 32px;
      height: 32px;
      border-radius: $radius-sm;
      object-fit: cover;
    }

    &-title {
      display: block;
      font-size: 11px;
      color: $ink-600;
      max-width: 120px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &-price {
      font-family: $font-display;
      font-size: 13px;
      color: $accent-caramel;
    }
  }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 0;

  &__date {
    text-align: center;
    font-size: 11px;
    color: $ink-300;
    padding: 6px 14px;
    border-radius: $radius-pill;
    background: $cream-200;
    align-self: center;
  }

  &__empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    p {
      font-size: 14px;
      color: $ink-300;
    }
  }
}

.chat-msg {
  display: flex;
  gap: 10px;
  align-items: flex-end;

  &--mine {
    flex-direction: row-reverse;
  }

  &__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: $cream-300;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__bubble {
    max-width: 60%;
    padding: 12px 16px;
    border-radius: $radius-lg;
    background: $cream-200;
    position: relative;

    p {
      font-size: 14px;
      line-height: 1.6;
      color: $ink-900;
      word-break: break-word;
    }

    .chat-msg--mine & {
      background: $ink-900;
      border-bottom-right-radius: $radius-xs;

      p { color: $cream-50; }
      .chat-msg__time { color: $cream-400; }
    }

    &:not(.chat-msg--mine &) {
      border-bottom-left-radius: $radius-xs;
    }
  }

  &__time {
    display: block;
    font-size: 10px;
    color: $ink-300;
    font-family: $font-mono;
    margin-top: 4px;
  }
}

.chat-quick {
  display: flex;
  gap: 6px;
  padding: 8px 24px;
  overflow-x: auto;
  background: $cream-50;
  border-top: 1px solid $cream-200;
  flex-shrink: 0;

  &__btn {
    flex-shrink: 0;
    padding: 6px 14px;
    border-radius: $radius-pill;
    background: $cream-200;
    font-size: 11px;
    color: $ink-600;
    cursor: pointer;
    transition: all .3s $ease-fluid;
    white-space: nowrap;

    &:hover {
      background: $ink-900;
      color: $cream-50;
    }
  }
}

.chat-input {
  display: flex;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid $cream-300;
  background: $cream-50;
  flex-shrink: 0;

  &__field {
    flex: 1;
    padding: 12px 18px;
    border-radius: $radius-pill;
    border: 1.5px solid $cream-300;
    background: $cream-100;
    font-size: 14px;
    color: $ink-900;
    outline: none;
    transition: all .3s $ease-soft;
    font-family: $font-sans;

    &::placeholder { color: $ink-300; }
    &:focus { border-color: $ink-800; background: $cream-50; }
  }

  &__send {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: $ink-900;
    color: $cream-50;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all .35s $ease-fluid;
    flex-shrink: 0;

    svg { width: 18px; height: 18px; }

    &:hover:not(:disabled) {
      background: $accent-caramel;
      transform: scale(1.05);
    }
    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
}

@media (max-width: 768px) {
  .chat-view {
    padding: 16px 0 0;
    height: calc(100vh - 64px);

    &__container {
      border-radius: 0;
      grid-template-columns: 1fr;
    }
  }
  .chat-sidebar { display: none; }
  .chat-header__back { display: flex; }
}
</style>
