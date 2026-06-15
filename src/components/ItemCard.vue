<template>
  <div class="item-card" @click="$router.push(`/items/${item.id}`)">
    <div class="item-card__outer">
      <div class="item-card__inner">
        <div class="item-card__img-wrap">
          <img :src="item.cover" :alt="item.title" loading="lazy" />
          <span v-if="item.condition" class="item-card__condition">{{ item.condition }}</span>
          <button class="item-card__fav" :class="{ 'item-card__fav--active': isFav }" @click.stop="toggleFav">
            <svg viewBox="0 0 24 24" :fill="isFav ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
        <div class="item-card__body">
          <h3 class="item-card__title">{{ item.title }}</h3>
          <div class="item-card__meta">
            <span class="item-card__cat">{{ item.categoryName }}</span>
            <span class="item-card__dot" />
            <span class="item-card__campus">{{ item.sellerCampus }}</span>
          </div>
          <div class="item-card__price-row">
            <div class="item-card__price">
              <span class="item-card__symbol">¥</span>{{ item.price }}
            </div>
            <span class="item-card__original">¥{{ item.originalPrice }}</span>
          </div>
          <div class="item-card__footer">
            <div class="item-card__seller">
              <img :src="item.sellerAvatar" alt="" />
              <span>{{ item.sellerName }}</span>
            </div>
            <span class="item-card__time">{{ item.createdAt?.split(' ')[0] }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFavoriteStore } from '@/stores/favorite'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  item: { type: Object, required: true }
})

const userStore = useUserStore()
const favStore = useFavoriteStore()
const isFav = computed(() => favStore.isFavorite(props.item.id))

function toggleFav() {
  if (!userStore.isLoggedIn) {
    userStore.openLoginDialog()
    return
  }
  favStore.toggleFavorite(props.item)
}
</script>

<style lang="scss" scoped>
.item-card {
  cursor: pointer;
  transition: transform .5s $ease-fluid;

  &:hover {
    transform: translateY(-6px);

    .item-card__img-wrap img {
      transform: scale(1.06);
    }
  }

  &__outer {
    padding: 3px;
    border-radius: $radius-xl;
    background: rgba(20, 32, 26, 0.04);
    transition: all .5s $ease-fluid;
  }
  &:hover &__outer {
    background: rgba(20, 32, 26, 0.07);
  }

  &__inner {
    border-radius: calc(#{$radius-xl} - 3px);
    background: $cream-50;
    overflow: hidden;
    box-shadow: $shadow-inner-light;
  }

  &__img-wrap {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform .7s $ease-fluid;
    }
  }

  &__condition {
    position: absolute;
    top: 12px;
    left: 12px;
    padding: 4px 10px;
    border-radius: $radius-pill;
    background: rgba(20, 32, 26, 0.7);
    backdrop-filter: blur(8px);
    color: $cream-50;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.03em;
  }

  &__fav {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(253, 251, 246, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: $ink-400;
    transition: all .35s $ease-fluid;

    svg { width: 16px; height: 16px; }

    &:hover { transform: scale(1.15); color: $accent-caramel; }
    &--active {
      color: $accent-caramel;
      background: rgba(200, 99, 43, 0.15);
    }
  }

  &__body {
    padding: 16px 18px 18px;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: $ink-900;
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 8px;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: $ink-400;
    margin-bottom: 12px;
  }
  &__dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: $ink-300;
  }

  &__price-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 14px;
  }

  &__price {
    font-family: $font-display;
    font-size: 24px;
    color: $accent-caramel;
    line-height: 1;
  }
  &__symbol {
    font-size: 14px;
    margin-right: 1px;
  }
  &__original {
    font-size: 12px;
    color: $ink-300;
    text-decoration: line-through;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid $cream-200;
  }

  &__seller {
    display: flex;
    align-items: center;
    gap: 6px;

    img {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      object-fit: cover;
    }
    span {
      font-size: 12px;
      color: $ink-400;
    }
  }
  &__time {
    font-size: 11px;
    color: $ink-300;
    font-family: $font-mono;
  }
}
</style>
