<template>
  <div class="comment-list">
    <div class="comment-list__header">
      <h3>留言 {{ comments.length }}</h3>
    </div>

    <div v-if="comments.length" class="comment-list__items">
      <div v-for="c in comments" :key="c.id" class="comment-list__item">
        <img :src="c.avatar" :alt="c.nickname" class="comment-list__avatar" />
        <div class="comment-list__body">
          <div class="comment-list__meta">
            <span class="comment-list__name">{{ c.nickname }}</span>
            <span class="comment-list__time">{{ c.time }}</span>
          </div>
          <p class="comment-list__content">{{ c.content }}</p>
        </div>
      </div>
    </div>

    <div v-else class="comment-list__empty">
      <p>暂无留言，来做第一个留言的人吧</p>
    </div>

    <div class="comment-list__input" v-if="userStore.isLoggedIn">
      <img :src="userStore.avatar" alt="" class="comment-list__avatar" />
      <div class="comment-list__input-wrap">
        <input
          v-model="newComment"
          type="text"
          placeholder="写下你的留言..."
          @keyup.enter="submitComment"
        />
        <button @click="submitComment" :disabled="!newComment.trim()">发送</button>
      </div>
    </div>
    <div v-else class="comment-list__login-hint">
      <button @click="userStore.openLoginDialog()">登录后即可留言</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { addComment } from '@/api/item'

const props = defineProps({
  itemId: { type: String, required: true },
  comments: { type: Array, default: () => [] }
})
const emit = defineEmits(['added'])

const userStore = useUserStore()
const newComment = ref('')

async function submitComment() {
  const content = newComment.value.trim()
  if (!content) return
  try {
    const data = {
      userId: userStore.userId,
      nickname: userStore.currentUser.nickname,
      avatar: userStore.avatar,
      content
    }
    const res = await addComment(props.itemId, data)
    if (res.code === 0) {
      emit('added', res.data)
      newComment.value = ''
    }
  } catch {}
}
</script>

<style lang="scss" scoped>
.comment-list {
  &__header {
    margin-bottom: 20px;
    h3 {
      font-family: $font-display;
      font-size: 20px;
      color: $ink-900;
    }
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__item {
    display: flex;
    gap: 14px;
    padding: 14px;
    border-radius: $radius-md;
    background: $cream-100;
    transition: background .3s $ease-soft;

    &:hover {
      background: $cream-200;
    }
  }

  &__avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: $cream-300;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }

  &__name {
    font-size: 13px;
    font-weight: 600;
    color: $ink-800;
  }

  &__time {
    font-size: 11px;
    color: $ink-300;
    font-family: $font-mono;
  }

  &__content {
    font-size: 14px;
    line-height: 1.6;
    color: $ink-600;
  }

  &__empty {
    padding: 40px 0;
    text-align: center;
    color: $ink-300;
    font-size: 14px;
  }

  &__input {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-top: 20px;
    padding: 12px;
    border-radius: $radius-md;
    background: $cream-100;

    &-wrap {
      flex: 1;
      display: flex;
      gap: 8px;

      input {
        flex: 1;
        padding: 10px 14px;
        border-radius: $radius-pill;
        border: 1.5px solid $cream-300;
        background: $cream-50;
        font-size: 14px;
        outline: none;
        transition: all .3s $ease-soft;

        &::placeholder { color: $ink-300; }
        &:focus {
          border-color: $ink-800;
        }
      }

      button {
        padding: 10px 20px;
        border-radius: $radius-pill;
        background: $ink-900;
        color: $cream-50;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all .3s $ease-fluid;

        &:hover { background: $accent-caramel; }
        &:disabled { opacity: 0.4; cursor: not-allowed; }
      }
    }
  }

  &__login-hint {
    margin-top: 16px;
    text-align: center;

    button {
      padding: 10px 28px;
      border-radius: $radius-pill;
      border: 1.5px solid $ink-800;
      color: $ink-800;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all .3s $ease-fluid;

      &:hover {
        background: $ink-800;
        color: $cream-50;
      }
    }
  }
}
</style>
