<template>
  <div class="chat-list">
    <div class="chat-list__head">
      <h2>私信</h2>
      <span class="chat-list__count">{{ conversations.length }} 个对话</span>
    </div>

    <div v-if="conversations.length" class="chat-list__items">
      <router-link
        v-for="conv in conversations"
        :key="conv.id"
        :to="`/chat/${conv.id}`"
        class="chat-row"
        @click="chatStore.markConversationRead(conv.id)"
      >
        <div class="chat-row__avatar-wrap">
          <img :src="conv.otherUser.avatar" :alt="conv.otherUser.nickname" />
          <span v-if="getUnread(conv)" class="chat-row__unread">{{ getUnread(conv) }}</span>
        </div>
        <div class="chat-row__info">
          <div class="chat-row__top">
            <h4>{{ conv.otherUser.nickname }}</h4>
            <span class="chat-row__time">{{ formatTime(conv.lastTime) }}</span>
          </div>
          <div class="chat-row__item-info">
            <img :src="conv.itemCover" alt="" />
            <span>{{ conv.itemTitle }}</span>
            <strong>¥{{ conv.itemPrice }}</strong>
          </div>
          <p class="chat-row__preview">
            {{ conv.lastMessage || '还没有消息' }}
          </p>
        </div>
      </router-link>
    </div>

    <EmptyState
      v-else
      title="暂无私信"
      desc="在商品详情页点击「联系卖家」即可发起私信"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import EmptyState from '@/components/EmptyState.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const chatStore = useChatStore()
const userStore = useUserStore()

const conversations = computed(() =>
  chatStore.getMyConversations(userStore.userId)
)

function getUnread(conv) {
  return conv.messages.filter(m => !m.read && !m.isMine).length
}

function formatTime(time) {
  if (!time) return ''
  try {
    return dayjs(new Date(time)).fromNow()
  } catch {
    return time
  }
}
</script>

<style lang="scss" scoped>
.chat-list {
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      font-family: $font-display;
      font-size: 24px;
      color: $ink-900;
    }
  }

  &__count {
    padding: 4px 12px;
    border-radius: $radius-pill;
    background: $cream-200;
    font-family: $font-mono;
    font-size: 12px;
    color: $ink-600;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

.chat-row {
  display: flex;
  gap: 14px;
  padding: 14px 16px;
  border-radius: $radius-md;
  background: $cream-100;
  transition: all .35s $ease-fluid;

  &:hover {
    background: $cream-50;
    box-shadow: $shadow-soft;
    transform: translateX(4px);
  }

  &__avatar-wrap {
    position: relative;
    flex-shrink: 0;
  }

  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: $cream-300;
    object-fit: cover;
  }

  &__unread {
    position: absolute;
    top: -2px;
    right: -2px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: $radius-pill;
    background: $accent-caramel;
    color: $cream-50;
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;

    h4 {
      font-size: 14px;
      font-weight: 600;
      color: $ink-900;
    }
  }

  &__time {
    font-size: 11px;
    color: $ink-300;
    font-family: $font-mono;
  }

  &__item-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
    padding: 4px 10px;
    border-radius: $radius-pill;
    background: $cream-200;

    img {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      object-fit: cover;
    }

    span {
      font-size: 11px;
      color: $ink-600;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    strong {
      font-size: 11px;
      color: $accent-caramel;
      font-family: $font-display;
      flex-shrink: 0;
    }
  }

  &__preview {
    font-size: 13px;
    color: $ink-400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
