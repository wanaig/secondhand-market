<template>
  <div class="profile">
    <div class="profile__container">
      <!-- 用户信息卡 -->
      <div class="profile__hero">
        <div class="profile__hero-bg">
          <span class="profile__hero-bg-text">PROFILE · {{ user?.nickname?.toUpperCase() }}</span>
        </div>
        <div class="profile__hero-content">
          <img :src="userStore.avatar" alt="" class="profile__avatar" />
          <div class="profile__user-info">
            <div class="profile__nick-row">
              <h1 class="profile__nickname">{{ user?.nickname }}</h1>
              <span class="profile__campus">{{ user?.campus }}</span>
            </div>
            <p class="profile__sub">@{{ user?.username }} · 加入于 {{ joinDate }}</p>
          </div>
          <div class="profile__stats">
            <div class="profile__stat">
              <strong>{{ publishCount }}</strong>
              <span>发布</span>
            </div>
            <div class="profile__stat">
              <strong>{{ orderCount }}</strong>
              <span>订单</span>
            </div>
            <div class="profile__stat">
              <strong>{{ favCount }}</strong>
              <span>收藏</span>
            </div>
            <div class="profile__stat">
              <strong>{{ chatCount }}</strong>
              <span>私信</span>
            </div>
          </div>
          <button class="profile__logout" @click="onLogout">退出登录</button>
        </div>
      </div>

      <!-- 页签 + 内容 -->
      <div class="profile__main">
        <nav class="profile__nav">
          <router-link to="/profile/publish" class="profile__nav-item">
            <span class="profile__nav-icon">◐</span>
            <div>
              <div class="profile__nav-name">我的发布</div>
              <div class="profile__nav-desc">管理在售商品</div>
            </div>
          </router-link>
          <router-link to="/profile/orders" class="profile__nav-item">
            <span class="profile__nav-icon">◈</span>
            <div>
              <div class="profile__nav-name">我的订单</div>
              <div class="profile__nav-desc">购买/交易记录</div>
            </div>
          </router-link>
          <router-link to="/profile/favorite" class="profile__nav-item">
            <span class="profile__nav-icon">♡</span>
            <div>
              <div class="profile__nav-name">我的收藏</div>
              <div class="profile__nav-desc">心仪的好物</div>
            </div>
          </router-link>
          <router-link to="/profile/chats" class="profile__nav-item">
            <span class="profile__nav-icon">⌬</span>
            <div>
              <div class="profile__nav-name">私信</div>
              <div class="profile__nav-desc">与同学的对话</div>
            </div>
          </router-link>
          <router-link to="/profile/messages" class="profile__nav-item">
            <span class="profile__nav-icon">◎</span>
            <div>
              <div class="profile__nav-name">站内消息</div>
              <div class="profile__nav-desc">系统通知</div>
            </div>
          </router-link>
        </nav>

        <div class="profile__content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useFavoriteStore } from '@/stores/favorite'
import { useMessageStore } from '@/stores/message'
import { useItemStore } from '@/stores/item'
import { useOrderStore } from '@/stores/order'
import { useChatStore } from '@/stores/chat'
import dayjs from 'dayjs'

const userStore = useUserStore()
const favStore = useFavoriteStore()
const msgStore = useMessageStore()
const itemStore = useItemStore()
const orderStore = useOrderStore()
const chatStore = useChatStore()
const router = useRouter()

const user = computed(() => userStore.currentUser)
const joinDate = computed(() => user.value ? dayjs(user.value.createTime).format('YYYY.MM') : '')

const publishCount = computed(() => itemStore.myPublished.length)
const orderCount = computed(() => orderStore.getMyOrders(userStore.userId).length)
const favCount = computed(() => favStore.count)
const chatCount = computed(() => chatStore.getMyConversations(userStore.userId).length)

function onLogout() {
  userStore.logout()
  router.push('/')
}
</script>

<style lang="scss" scoped>
.profile {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 32px 80px;

  &__hero {
    position: relative;
    padding: 40px 48px;
    border-radius: $radius-xl;
    background: $ink-900;
    color: $cream-50;
    overflow: hidden;
    margin-bottom: 32px;
  }

  &__hero-bg {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    overflow: hidden;
    pointer-events: none;

    &-text {
      font-family: $font-display;
      font-style: italic;
      font-size: clamp(80px, 14vw, 200px);
      color: rgba(253, 251, 246, 0.04);
      letter-spacing: -0.04em;
      white-space: nowrap;
      transform: translateX(-10%);
    }
  }

  &__hero-content {
    position: relative;
    display: flex;
    align-items: center;
    gap: 24px;
  }

  &__avatar {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: $cream-300;
    object-fit: cover;
    border: 3px solid $accent-caramel;
  }

  &__user-info {
    flex: 1;
  }

  &__nick-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;
  }

  &__nickname {
    font-family: $font-display;
    font-size: 32px;
    color: $cream-50;
  }

  &__campus {
    padding: 4px 12px;
    border-radius: $radius-pill;
    background: rgba(253, 251, 246, 0.12);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  &__sub {
    font-size: 13px;
    color: $cream-400;
    font-family: $font-mono;
  }

  &__stats {
    display: flex;
    gap: 32px;
    padding: 0 32px;
    border-left: 1px solid rgba(253, 251, 246, 0.1);
    border-right: 1px solid rgba(253, 251, 246, 0.1);
  }

  &__stat {
    text-align: center;

    strong {
      display: block;
      font-family: $font-display;
      font-size: 32px;
      line-height: 1;
      color: $cream-50;
    }
    span {
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: $cream-400;
      margin-top: 6px;
      display: inline-block;
    }
  }

  &__logout {
    padding: 10px 22px;
    border-radius: $radius-pill;
    border: 1.5px solid rgba(253, 251, 246, 0.2);
    color: $cream-200;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all .3s $ease-fluid;

    &:hover {
      background: $accent-caramel;
      border-color: $accent-caramel;
      color: $cream-50;
    }
  }

  &__main {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 24px;
    align-items: flex-start;
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 16px;
    border-radius: $radius-xl;
    background: $cream-50;
    border: 1px solid rgba(20, 32, 26, 0.06);
    box-shadow: $shadow-soft;
    position: sticky;
    top: 110px;

    &-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      border-radius: $radius-md;
      color: $ink-600;
      transition: all .35s $ease-fluid;
      cursor: pointer;

      &.router-link-active {
        background: $ink-900;
        color: $cream-50;

        .profile__nav-icon { color: $accent-caramel; }
        .profile__nav-desc { color: $cream-400; }
      }

      &:not(.router-link-active):hover {
        background: $cream-200;
      }
    }

    &-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: $cream-200;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: $font-display;
      font-size: 18px;
      color: $accent-caramel;
      flex-shrink: 0;
    }

    &-item.router-link-active &-icon {
      background: rgba(200, 99, 43, 0.15);
    }

    &-name {
      font-size: 14px;
      font-weight: 600;
    }
    &-desc {
      font-size: 11px;
      color: $ink-400;
    }
  }

  &__content {
    padding: 32px;
    border-radius: $radius-xl;
    background: $cream-50;
    border: 1px solid rgba(20, 32, 26, 0.06);
    box-shadow: $shadow-soft;
    min-height: 400px;
  }
}

@media (max-width: 1024px) {
  .profile__hero-content { flex-wrap: wrap; }
  .profile__stats { padding: 0; border: none; gap: 24px; }
  .profile__main { grid-template-columns: 1fr; }
  .profile__nav {
    position: static;
    flex-direction: row;
    overflow-x: auto;
    flex-wrap: wrap;
  }
  .profile__nav-item { flex: 1; min-width: 200px; }
}
@media (max-width: 768px) {
  .profile { padding: 16px; }
  .profile__hero { padding: 24px; }
}
</style>
