<template>
  <div class="item-detail">
    <div class="item-detail__container">
      <!-- 返回 + 面包屑 -->
      <div class="item-detail__breadcrumb">
        <router-link to="/">首页</router-link>
        <span>/</span>
        <router-link to="/items">全部好物</router-link>
        <span>/</span>
        <span class="current">{{ item?.title || '加载中...' }}</span>
      </div>

      <div v-if="item" class="item-detail__main">
        <!-- 左侧：图片 -->
        <div class="item-detail__left">
          <ImageCarousel :images="item.images" />
        </div>

        <!-- 右侧：信息 -->
        <div class="item-detail__right">
          <div class="item-detail__tags">
            <span class="item-detail__cond">{{ item.condition }}</span>
            <span class="item-detail__cat">{{ item.categoryName }}</span>
          </div>

          <h1 class="item-detail__title">{{ item.title }}</h1>

          <div class="item-detail__price-row">
            <span class="item-detail__price">¥{{ item.price }}</span>
            <span class="item-detail__original">原价 ¥{{ item.originalPrice }}</span>
            <span class="item-detail__discount">{{ discount }}折</span>
          </div>

          <div class="item-detail__meta">
            <div class="item-detail__meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <span>{{ item.views }} 次浏览</span>
            </div>
            <div class="item-detail__meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span>{{ item.favorites }} 人收藏</span>
            </div>
            <div class="item-detail__meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>{{ item.createdAt }}</span>
            </div>
          </div>

          <div class="item-detail__tags-row">
            <span v-for="t in item.tags" :key="t" class="item-detail__tag">{{ t }}</span>
          </div>

          <div class="item-detail__actions">
            <button class="item-detail__fav" :class="{ 'item-detail__fav--active': isFav }" @click="toggleFav">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" :fill="isFav ? 'currentColor' : 'none'"/>
              </svg>
              <span>{{ isFav ? '已收藏' : '收藏' }}</span>
            </button>
            <button class="item-detail__cart-btn" :class="{ 'item-detail__cart-btn--added': isInCart }" @click="addToCart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span>{{ isInCart ? '已在购物车' : '加入购物车' }}</span>
            </button>
            <button class="item-detail__buy" @click="buyNow">
              <span>立即购买</span>
              <span class="item-detail__buy-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17 17 7M9 7h8v8"/></svg>
              </span>
            </button>
          </div>

          <div class="item-detail__actions item-detail__actions--secondary">
            <button class="item-detail__chat" @click="startChat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
                <path d="M21 12c0 4-4 7-9 7-1.2 0-2.4-.2-3.5-.5L4 20l1.5-4C4 14.8 3 13.5 3 12c0-4 4-7 9-7s9 3 9 7Z"/>
              </svg>
              <span>联系卖家</span>
            </button>
          </div>

          <!-- 卖家卡片 -->
          <SellerCard
            :seller="{
              name: item.sellerName,
              avatar: item.sellerAvatar,
              campus: item.sellerCampus
            }"
          />
        </div>
      </div>

      <!-- 商品描述 + 评论 -->
      <div v-if="item" class="item-detail__bottom">
        <div class="item-detail__desc-section">
          <h3>商品描述</h3>
          <div class="item-detail__desc-content">
            <p v-for="(line, i) in item.description.split('\n')" :key="i">{{ line }}</p>
          </div>
        </div>
        <div class="item-detail__comment-section">
          <CommentList :itemId="item.id" :comments="item.comments" @added="onCommentAdded" />
        </div>
      </div>

      <div v-if="!item" class="item-detail__loading">
        <p>加载中...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getItem } from '@/api/item'
import { useFavoriteStore } from '@/stores/favorite'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useChatStore } from '@/stores/chat'
import ImageCarousel from '@/components/ImageCarousel.vue'
import SellerCard from '@/components/SellerCard.vue'
import CommentList from '@/components/CommentList.vue'

const route = useRoute()
const router = useRouter()
const favStore = useFavoriteStore()
const userStore = useUserStore()
const cartStore = useCartStore()
const chatStore = useChatStore()

const item = ref(null)

const isFav = computed(() => item.value ? favStore.isFavorite(item.value.id) : false)
const isInCart = computed(() => item.value ? cartStore.isInCart(item.value.id) : false)
const discount = computed(() => {
  if (!item.value) return ''
  return (item.value.price / item.value.originalPrice * 10).toFixed(1)
})

async function loadItem() {
  const res = await getItem(route.params.id)
  item.value = res.data
}

function toggleFav() {
  if (!userStore.isLoggedIn) {
    userStore.openLoginDialog()
    return
  }
  favStore.toggleFavorite({
    id: item.value.id,
    title: item.value.title,
    price: item.value.price,
    cover: item.value.cover,
    categoryName: item.value.categoryName,
    condition: item.value.condition,
    sellerName: item.value.sellerName,
    sellerAvatar: item.value.sellerAvatar,
    createdAt: item.value.createdAt
  })
}

function addToCart() {
  if (!userStore.isLoggedIn) {
    userStore.openLoginDialog()
    return
  }
  if (isInCart.value) {
    ElMessage.info('已在购物车中')
    return
  }
  cartStore.addItem({
    id: item.value.id,
    title: item.value.title,
    price: item.value.price,
    cover: item.value.cover,
    condition: item.value.condition,
    categoryName: item.value.categoryName,
    sellerId: item.value.sellerId,
    sellerName: item.value.sellerName,
    sellerAvatar: item.value.sellerAvatar
  })
  ElMessage.success('已加入购物车')
}

function buyNow() {
  if (!userStore.isLoggedIn) {
    userStore.openLoginDialog()
    return
  }
  const buyItem = {
    id: item.value.id,
    title: item.value.title,
    price: item.value.price,
    cover: item.value.cover,
    condition: item.value.condition,
    categoryName: item.value.categoryName,
    sellerId: item.value.sellerId,
    sellerName: item.value.sellerName,
    sellerAvatar: item.value.sellerAvatar
  }
  sessionStorage.setItem('glean_buy_now', JSON.stringify(buyItem))
  router.push({ path: '/checkout', query: { itemId: item.value.id } })
}

function startChat() {
  if (!userStore.isLoggedIn) {
    userStore.openLoginDialog()
    return
  }
  const conv = chatStore.createOrGetConversation(
    userStore.currentUser,
    {
      id: item.value.sellerId,
      nickname: item.value.sellerName,
      avatar: item.value.sellerAvatar,
      campus: item.value.sellerCampus
    },
    {
      id: item.value.id,
      title: item.value.title,
      cover: item.value.cover,
      price: item.value.price
    }
  )
  router.push(`/chat/${conv.id}`)
}

function onCommentAdded(c) {
  if (item.value) {
    item.value.comments.unshift(c)
  }
}

onMounted(loadItem)
</script>

<style lang="scss" scoped>
.item-detail {
  max-width: 1440px;
  margin: 0 auto;
  padding: 32px 32px 80px;

  &__breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: $ink-400;
    margin-bottom: 32px;

    a {
      color: $ink-400;
      transition: color .3s;

      &:hover { color: $accent-caramel; }
    }
    .current { color: $ink-800; font-weight: 500; }
  }

  &__main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 56px;
    margin-bottom: 56px;
  }

  &__left {
    position: sticky;
    top: 120px;
    align-self: start;
  }

  &__right {
    padding-top: 8px;
  }

  &__tags {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  &__cond {
    padding: 4px 12px;
    border-radius: $radius-pill;
    background: $accent-caramel;
    color: $cream-50;
    font-size: 11px;
    font-weight: 700;
  }

  &__cat {
    padding: 4px 12px;
    border-radius: $radius-pill;
    background: $cream-200;
    color: $ink-600;
    font-size: 11px;
    font-weight: 500;
  }

  &__title {
    font-family: $font-display;
    font-size: 34px;
    line-height: 1.2;
    color: $ink-900;
    margin-bottom: 20px;
  }

  &__price-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 24px;
  }

  &__price {
    font-family: $font-display;
    font-size: 44px;
    color: $accent-caramel;
  }

  &__original {
    font-size: 14px;
    color: $ink-300;
    text-decoration: line-through;
  }

  &__discount {
    padding: 3px 8px;
    border-radius: $radius-pill;
    background: rgba(90, 122, 78, 0.1);
    color: $accent-moss;
    font-size: 11px;
    font-weight: 700;
  }

  &__meta {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;

    &-item {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      color: $ink-400;

      svg { color: $ink-300; }
    }
  }

  &__tags-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 28px;
  }

  &__tag {
    padding: 5px 12px;
    border-radius: $radius-pill;
    border: 1px solid $cream-300;
    font-size: 12px;
    color: $ink-400;
  }

  &__actions {
    display: flex;
    gap: 10px;
    margin-bottom: 28px;
  }

  &__fav {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 12px 22px;
    border-radius: $radius-pill;
    border: 1.5px solid $ink-800;
    font-size: 14px;
    font-weight: 600;
    color: $ink-800;
    cursor: pointer;
    transition: all .35s $ease-fluid;

    &:hover { background: $cream-200; }
    &--active {
      background: $ink-900;
      color: $cream-50;
      border-color: $ink-900;
    }
  }

  &__cart-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 12px 22px;
    border-radius: $radius-pill;
    border: 1.5px solid $ink-800;
    background: transparent;
    font-size: 14px;
    font-weight: 600;
    color: $ink-800;
    cursor: pointer;
    transition: all .35s $ease-fluid;

    &:hover { background: $cream-200; }
    &--added {
      border-color: $accent-moss;
      color: $accent-moss;
      background: rgba(90, 122, 78, 0.06);
    }
  }

  &__buy {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 8px 8px 8px 24px;
    border-radius: $radius-pill;
    background: $accent-caramel;
    color: $cream-50;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all .4s $ease-fluid;

    &-arrow {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: inline-flex;
      align-items: center;
      justify-content: center;

      svg { width: 14px; height: 14px; }
    }

    &:hover {
      background: $accent-rust;
      transform: translateY(-2px);
      .item-detail__buy-arrow { background: rgba(255,255,255,0.35); transform: translate(2px, -2px); }
    }
    &:active { transform: scale(0.97); }
  }

  &__actions--secondary {
    margin-top: 8px;
    margin-bottom: 28px;
    gap: 10px;
  }

  &__chat {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 8px 16px;
    border-radius: $radius-pill;
    background: $cream-200;
    font-size: 12px;
    font-weight: 600;
    color: $ink-600;
    cursor: pointer;
    transition: all .3s $ease-fluid;

    &:hover {
      background: $ink-900;
      color: $cream-50;
    }
  }

  &__cart-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 12px 20px;
    border-radius: $radius-pill;
    border: 1.5px solid $ink-800;
    color: $ink-800;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all .35s $ease-fluid;

    &:hover { background: $ink-900; color: $cream-50; }

    &--added {
      background: $accent-moss;
      border-color: $accent-moss;
      color: $cream-50;

      &:hover { background: darken(#5A7A4E, 8%); }
    }
  }

  &__buy {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 6px 6px 22px;
    border-radius: $radius-pill;
    background: $accent-caramel;
    color: $cream-50;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all .4s $ease-fluid;

    &-arrow {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(253, 251, 246, 0.2);
      display: inline-flex;
      align-items: center;
      justify-content: center;

      svg { width: 14px; height: 14px; }
    }

    &:hover {
      background: $accent-rust;
      transform: translateY(-2px);
      .item-detail__buy-arrow {
        background: $cream-50;
        color: $accent-rust;
        transform: translate(2px, -2px);
      }
    }
    &:active { transform: scale(0.97); }
  }

  &__actions--secondary {
    margin-top: 8px;
    margin-bottom: 20px;
    gap: 8px;
  }

  &__chat {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: $radius-pill;
    font-size: 12px;
    font-weight: 500;
    color: $ink-600;
    cursor: pointer;
    transition: all .3s $ease-fluid;

    &:hover {
      background: $cream-200;
      color: $ink-900;
    }
  }

  &__chat {
    background: $cream-100;
    &:hover { background: $ink-900; color: $cream-50; }
  }

  &__cart-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 12px 22px;
    border-radius: $radius-pill;
    background: $cream-200;
    color: $ink-900;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all .35s $ease-fluid;
    border: 1.5px solid transparent;

    &:hover { background: $cream-300; transform: translateY(-1px); }

    &--added {
      background: rgba(90, 122, 78, 0.12);
      color: $accent-moss;
      border-color: rgba(90, 122, 78, 0.3);
    }
  }

  &__buy {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 8px 8px 8px 0;
    border-radius: $radius-pill;
    background: $ink-900;
    color: $cream-50;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all .4s $ease-fluid;

    &-arrow {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: $accent-caramel;
      display: inline-flex;
      align-items: center;
      justify-content: center;

      svg { width: 16px; height: 16px; }
    }

    &:hover {
      background: $accent-caramel;
      transform: translateY(-2px);
      .item-detail__buy-arrow { background: $cream-50; color: $accent-caramel; transform: translate(2px, -2px); }
    }
  }

  &__actions--secondary {
    margin-top: 4px;
    margin-bottom: 28px;
  }

  &__chat {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: $radius-pill;
    background: $cream-100;
    color: $ink-600;
    font-size: 12px;
    font-weight: 500;
    border: 1px solid $cream-300;
    cursor: pointer;
    transition: all .3s $ease-fluid;

    &:hover {
      background: $accent-caramel;
      color: $cream-50;
      border-color: $accent-caramel;
    }
  }

  &__bottom {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    padding-top: 40px;
    border-top: 1px solid $cream-300;
  }

  &__desc-section {
    h3 {
      font-family: $font-display;
      font-size: 24px;
      color: $ink-900;
      margin-bottom: 20px;
    }
  }

  &__desc-content {
    padding: 24px;
    border-radius: $radius-lg;
    background: $cream-100;

    p {
      font-size: 14px;
      line-height: 1.8;
      color: $ink-600;
      margin-bottom: 8px;
    }
  }

  &__loading {
    padding: 120px 0;
    text-align: center;
    color: $ink-400;
  }
}

@media (max-width: 1024px) {
  .item-detail__main { grid-template-columns: 1fr; }
  .item-detail__left { position: static; }
  .item-detail__bottom { grid-template-columns: 1fr; }
}
</style>
