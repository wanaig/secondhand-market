<template>
  <div class="my-message">
    <div class="my-message__head">
      <h2>消息中心</h2>
      <button v-if="msgStore.list.length" class="my-message__clear" @click="msgStore.clearAll">全部已读</button>
    </div>

    <div v-if="msgStore.list.length" class="my-message__list">
      <div
        v-for="msg in msgStore.list"
        :key="msg.id"
        class="my-message__item"
        :class="{ 'my-message__item--unread': !msg.read }"
        @click="msgStore.markRead(msg.id)"
      >
        <div class="my-message__dot" v-if="!msg.read"></div>
        <div class="my-message__icon">{{ msg.type === 'system' ? '⌂' : msg.type === 'comment' ? '◇' : '♡' }}</div>
        <div class="my-message__body">
          <div class="my-message__title">{{ msg.title }}</div>
          <div class="my-message__desc">{{ msg.content }}</div>
          <div class="my-message__time">{{ msg.time }}</div>
        </div>
        <router-link v-if="msg.link" :to="msg.link" class="my-message__link">查看 →</router-link>
      </div>
    </div>

    <EmptyState v-else title="暂无消息" desc="有新留言或系统通知时会出现在这里" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMessageStore } from '@/stores/message'
import EmptyState from '@/components/EmptyState.vue'

const msgStore = useMessageStore()

onMounted(() => {
  msgStore.markAllRead()
})
</script>

<style lang="scss" scoped>
.my-message {
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h2 {
      font-family: $font-display;
      font-size: 24px;
      color: $ink-900;
    }
  }

  &__clear {
    padding: 6px 14px;
    border-radius: $radius-pill;
    background: $cream-200;
    font-size: 12px;
    color: $ink-600;
    cursor: pointer;
    transition: all .3s $ease-fluid;

    &:hover { background: $ink-900; color: $cream-50; }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    border-radius: $radius-md;
    background: $cream-100;
    cursor: pointer;
    transition: all .3s $ease-soft;

    &:hover {
      background: $cream-200;
      transform: translateX(4px);
    }

    &--unread {
      background: rgba(200, 99, 43, 0.06);
      border-left: 3px solid $accent-caramel;
    }
  }

  &__dot {
    position: absolute;
    top: 18px;
    left: -1px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $accent-caramel;
  }

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: $radius-md;
    background: $cream-300;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: $font-display;
    font-size: 18px;
    color: $ink-600;
    flex-shrink: 0;
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: $ink-900;
    margin-bottom: 4px;
  }

  &__desc {
    font-size: 12px;
    color: $ink-400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__time {
    font-size: 11px;
    color: $ink-300;
    font-family: $font-mono;
    margin-top: 4px;
  }

  &__link {
    padding: 6px 14px;
    border-radius: $radius-pill;
    background: $ink-900;
    color: $cream-50;
    font-size: 11px;
    font-weight: 600;
    flex-shrink: 0;
    transition: all .3s $ease-fluid;

    &:hover { background: $accent-caramel; }
  }
}
</style>
