<template>
  <header class="navbar" :class="{ 'navbar--scrolled': scrolled }">
    <div class="navbar__inner">
      <!-- Logo -->
      <router-link to="/" class="navbar__logo">
        <span class="navbar__logo-mark">G</span>
        <span class="navbar__logo-text">
          <span class="navbar__logo-cn">拾光集</span>
          <span class="navbar__logo-en">GleanCampus / Est.2026</span>
        </span>
      </router-link>

      <!-- 中间导航 -->
      <nav class="navbar__nav">
        <router-link to="/" class="navbar__link" exact-active-class="navbar__link--active">首页</router-link>
        <router-link to="/items" class="navbar__link" active-class="navbar__link--active">全部好物</router-link>
        <div class="navbar__dropdown">
          <span class="navbar__link">分类<i class="dot" /></span>
          <div class="navbar__dropdown-panel">
            <router-link
              v-for="c in categories"
              :key="c.key"
              :to="`/category/${c.key}`"
              class="navbar__dropdown-item"
            >
              <span class="navbar__dropdown-icon">{{ c.icon }}</span>
              <div>
                <div class="navbar__dropdown-name">{{ c.name }}</div>
                <div class="navbar__dropdown-sub">{{ c.sub.join(' · ') }}</div>
              </div>
            </router-link>
          </div>
        </div>
      </nav>

      <!-- 右侧 -->
      <div class="navbar__actions">
        <button class="navbar__icon-btn" @click="goSearch" aria-label="搜索">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
          </svg>
        </button>

        <router-link to="/profile/messages" v-if="userStore.isLoggedIn" class="navbar__icon-btn navbar__icon-btn--badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 12c0 4-4 7-9 7-1.2 0-2.4-.2-3.5-.5L4 20l1.5-4C4 14.8 3 13.5 3 12c0-4 4-7 9-7s9 3 9 7Z"/>
          </svg>
          <span v-if="msgStore.unreadCount" class="navbar__badge">{{ msgStore.unreadCount }}</span>
        </router-link>

        <router-link to="/cart" class="navbar__icon-btn navbar__icon-btn--badge" aria-label="购物车">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span v-if="cartStore.count" class="navbar__badge navbar__badge--caramel">{{ cartStore.count }}</span>
        </router-link>

        <button class="navbar__publish" @click="goPublish">
          <span>发布好物</span>
          <span class="navbar__publish-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M7 17 17 7M9 7h8v8"/>
            </svg>
          </span>
        </button>

        <div v-if="userStore.isLoggedIn" class="navbar__user" @click="toggleUserMenu">
          <img :src="userStore.avatar" alt="" />
          <span class="navbar__user-name">{{ userStore.currentUser.nickname }}</span>
          <transition name="fade">
            <div v-if="showUserMenu" class="navbar__user-menu" @click.stop>
              <router-link to="/profile/publish" class="navbar__user-item" @click="showUserMenu=false">
                <span>我的发布</span><i>→</i>
              </router-link>
              <router-link to="/profile/orders" class="navbar__user-item" @click="showUserMenu=false">
                <span>我的订单</span><i>→</i>
              </router-link>
              <router-link to="/cart" class="navbar__user-item" @click="showUserMenu=false">
                <span>购物车</span><i v-if="cartStore.count" class="navbar__user-num">{{ cartStore.count }}</i><i v-else>→</i>
              </router-link>
              <router-link to="/profile/favorite" class="navbar__user-item" @click="showUserMenu=false">
                <span>我的收藏</span><i>→</i>
              </router-link>
              <router-link to="/profile/chats" class="navbar__user-item" @click="showUserMenu=false">
                <span>私信</span><i v-if="chatStore.unreadTotal" class="navbar__user-num">{{ chatStore.unreadTotal }}</i><i v-else>→</i>
              </router-link>
              <router-link to="/profile/messages" class="navbar__user-item" @click="showUserMenu=false">
                <span>站内消息</span><i>→</i>
              </router-link>
              <div class="navbar__user-divider" />
              <button class="navbar__user-item navbar__user-item--logout" @click="onLogout">
                <span>退出登录</span><i>↗</i>
              </button>
            </div>
          </transition>
        </div>

        <button v-else class="navbar__login-btn" @click="userStore.openLoginDialog()">
          登录 / 注册
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useMessageStore } from '@/stores/message'
import { useCartStore } from '@/stores/cart'
import { useChatStore } from '@/stores/chat'
import { categories } from '@/mock'

const router = useRouter()
const userStore = useUserStore()
const msgStore = useMessageStore()
const cartStore = useCartStore()
const chatStore = useChatStore()

const scrolled = ref(false)
const showUserMenu = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 24
}
function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}
function closeMenuOnClick(e) {
  if (!e.target.closest('.navbar__user')) showUserMenu.value = false
}
function goSearch() {
  router.push('/search')
}
function goPublish() {
  if (!userStore.isLoggedIn) {
    userStore.openLoginDialog()
    return
  }
  router.push('/publish')
}
function onLogout() {
  userStore.logout()
  showUserMenu.value = false
  router.push('/')
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', closeMenuOnClick)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', closeMenuOnClick)
})
</script>

<style lang="scss" scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 18px 32px;
  transition: padding .5s $ease-fluid;

  &__inner {
    max-width: 1440px;
    margin: 0 auto;
    height: 64px;
    display: flex;
    align-items: center;
    gap: 32px;
    padding: 0 8px 0 24px;
    border-radius: $radius-pill;
    background: rgba(253, 251, 246, 0.78);
    backdrop-filter: blur(20px) saturate(140%);
    -webkit-backdrop-filter: blur(20px) saturate(140%);
    border: 1px solid rgba(20, 32, 26, 0.06);
    box-shadow: $shadow-soft;
    transition: all .5s $ease-fluid;
  }

  &--scrolled &__inner {
    box-shadow: $shadow-medium;
    background: rgba(253, 251, 246, 0.92);
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;

    &-mark {
      width: 40px;
      height: 40px;
      border-radius: $radius-md;
      background: $ink-800;
      color: $cream-50;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: $font-display;
      font-size: 22px;
      font-style: italic;
      transform: rotate(-6deg);
      transition: all .5s $ease-spring;
    }
    &:hover &-mark {
      transform: rotate(0deg) scale(1.05);
      background: $accent-caramel;
    }

    &-text {
      display: flex;
      flex-direction: column;
      line-height: 1.05;
    }
    &-cn {
      font-family: $font-display;
      font-size: 20px;
      color: $ink-900;
      letter-spacing: 0.02em;
    }
    &-en {
      font-size: 9px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: $ink-400;
      font-weight: 500;
    }
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    margin-left: 16px;
  }
  &__link {
    position: relative;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    color: $ink-600;
    border-radius: $radius-pill;
    cursor: pointer;
    transition: all .35s $ease-fluid;
    display: inline-flex;
    align-items: center;
    gap: 6px;

    .dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: $accent-caramel;
      display: inline-block;
    }

    &:hover {
      color: $ink-900;
      background: rgba(20, 32, 26, 0.04);
    }
    &--active {
      color: $cream-50;
      background: $ink-800;
      &:hover { background: $ink-900; color: $cream-50;}
    }
  }

  &__dropdown {
    position: relative;

    &-panel {
      position: absolute;
      top: calc(100% + 12px);
      left: -20px;
      width: 480px;
      padding: 14px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px;
      border-radius: $radius-lg;
      background: $cream-50;
      box-shadow: $shadow-strong;
      border: 1px solid rgba(20, 32, 26, 0.06);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-8px);
      transition: all .35s $ease-fluid;
    }
    &:hover &-panel {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    &-item {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      padding: 12px;
      border-radius: $radius-md;
      transition: background .3s $ease-soft;

      &:hover {
        background: $cream-200;
      }
    }
    &-icon {
      font-family: $font-mono;
      font-size: 11px;
      letter-spacing: 0.1em;
      color: $accent-caramel;
      padding-top: 2px;
      flex-shrink: 0;
    }
    &-name {
      font-size: 14px;
      font-weight: 600;
      color: $ink-900;
      margin-bottom: 2px;
    }
    &-sub {
      font-size: 11px;
      color: $ink-400;
      line-height: 1.5;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  &__icon-btn {
    position: relative;
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: $ink-800;
    transition: all .35s $ease-fluid;

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
      background: rgba(20, 32, 26, 0.06);
      transform: scale(1.05);
    }
  }

  &__badge {
    position: absolute;
    top: 4px;
    right: 4px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: $radius-pill;
    background: $accent-caramel;
    color: $cream-50;
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;

    &--caramel { background: $accent-caramel; }
  }

  &__user-num {
    font-style: normal;
    padding: 1px 8px;
    border-radius: $radius-pill;
    background: $accent-caramel;
    color: $cream-50;
    font-family: $font-mono;
    font-size: 10px;
    font-weight: 700;
  }

  &__publish {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 6px 6px 18px;
    border-radius: $radius-pill;
    background: $ink-900;
    color: $cream-50;
    font-size: 13px;
    font-weight: 600;
    transition: all .4s $ease-fluid;

    &-arrow {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: $accent-caramel;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all .4s $ease-fluid;

      svg {
        width: 14px;
        height: 14px;
      }
    }

    &:hover {
      background: $accent-caramel;
      transform: translateY(-1px);
    }
    &:hover &-arrow {
      background: $cream-50;
      color: $accent-caramel;
      transform: translate(2px, -2px) rotate(0deg);
    }
    &:active {
      transform: scale(0.97);
    }
  }

  &__login-btn {
    padding: 9px 18px;
    font-size: 13px;
    font-weight: 600;
    color: $ink-900;
    border-radius: $radius-pill;
    border: 1px solid $ink-800;
    transition: all .35s $ease-fluid;

    &:hover {
      background: $ink-900;
      color: $cream-50;
    }
  }

  &__user {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 14px 4px 4px;
    border-radius: $radius-pill;
    cursor: pointer;
    transition: background .3s $ease-soft;

    img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: $cream-300;
      object-fit: cover;
    }

    &:hover {
      background: rgba(20, 32, 26, 0.06);
    }

    &-name {
      font-size: 13px;
      font-weight: 600;
      color: $ink-800;
    }

    &-menu {
      position: absolute;
      top: calc(100% + 12px);
      right: 0;
      min-width: 200px;
      padding: 8px;
      background: $cream-50;
      border-radius: $radius-md;
      box-shadow: $shadow-strong;
      border: 1px solid rgba(20, 32, 26, 0.06);
    }

    &-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 10px 14px;
      font-size: 13px;
      color: $ink-800;
      border-radius: $radius-sm;
      transition: all .3s $ease-soft;
      text-align: left;

      i {
        font-style: normal;
        color: $ink-300;
        transition: transform .3s $ease-soft;
      }

      &:hover {
        background: $cream-200;
        color: $ink-900;
        i { transform: translateX(4px); color: $accent-caramel; }
      }

      &--logout {
        color: $danger;
      }
    }

    &-divider {
      height: 1px;
      background: $cream-300;
      margin: 6px 8px;
    }
  }
}

@media (max-width: 1024px) {
  .navbar {
    padding: 12px 16px;
    &__inner {
      padding: 0 6px 0 16px;
      gap: 12px;
    }
    &__nav {
      display: none;
    }
    &__logo-text {
      display: none;
    }
  }
}
</style>
