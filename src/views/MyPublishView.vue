<template>
  <div class="my-publish">
    <div class="my-publish__head">
      <h2>我的发布</h2>
      <router-link to="/publish" class="my-publish__add">+ 发布新商品</router-link>
    </div>

    <div v-if="published.length" class="my-publish__list">
      <div v-for="item in published" :key="item.id" class="my-publish__item">
        <img :src="item.cover" alt="" class="my-publish__img" />
        <div class="my-publish__info">
          <h3>{{ item.title }}</h3>
          <div class="my-publish__meta">
            <span class="my-publish__price">¥{{ item.price }}</span>
            <span class="my-publish__cond">{{ item.condition }}</span>
            <span class="my-publish__time">{{ item.createdAt }}</span>
          </div>
          <div class="my-publish__stats-row">
            <span>{{ item.views }} 浏览</span>
            <span>{{ item.favorites }} 收藏</span>
            <span>{{ item.comments?.length || 0 }} 留言</span>
          </div>
        </div>
        <div class="my-publish__actions">
          <router-link :to="`/items/${item.id}`" class="my-publish__btn my-publish__btn--view">查看</router-link>
          <router-link :to="`/edit/${item.id}`" class="my-publish__btn my-publish__btn--edit">编辑</router-link>
          <button class="my-publish__btn my-publish__btn--delete" @click="onDelete(item.id)">删除</button>
        </div>
      </div>
    </div>

    <EmptyState v-else title="还没有发布过好物" desc="点击右上角发布你的第一件闲置吧" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useItemStore } from '@/stores/item'
import { deleteItem } from '@/api/item'
import EmptyState from '@/components/EmptyState.vue'

const itemStore = useItemStore()

const published = computed(() => itemStore.myPublished)

async function onDelete(id) {
  await deleteItem(id)
  await itemStore.fetchMyPublished()
}
</script>

<style lang="scss" scoped>
.my-publish {
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

  &__add {
    padding: 8px 18px;
    border-radius: $radius-pill;
    background: $ink-900;
    color: $cream-50;
    font-size: 12px;
    font-weight: 600;
    transition: all .3s $ease-fluid;

    &:hover { background: $accent-caramel; }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__item {
    display: flex;
    gap: 16px;
    padding: 16px;
    border-radius: $radius-md;
    background: $cream-100;
    transition: all .3s $ease-soft;

    &:hover {
      background: $cream-200;
      transform: translateX(4px);
    }
  }

  &__img {
    width: 88px;
    height: 88px;
    border-radius: $radius-md;
    object-fit: cover;
    background: $cream-300;
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
    min-width: 0;

    h3 {
      font-size: 15px;
      font-weight: 600;
      color: $ink-900;
      margin-bottom: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  &__price {
    font-family: $font-display;
    font-size: 18px;
    color: $accent-caramel;
  }

  &__cond {
    padding: 2px 8px;
    border-radius: $radius-pill;
    background: $cream-300;
    font-size: 10px;
    color: $ink-600;
  }

  &__time {
    font-size: 11px;
    color: $ink-300;
    font-family: $font-mono;
  }

  &__stats-row {
    display: flex;
    gap: 12px;
    font-size: 11px;
    color: $ink-400;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex-shrink: 0;
    justify-content: center;
  }

  &__btn {
    padding: 6px 14px;
    border-radius: $radius-pill;
    font-size: 11px;
    font-weight: 600;
    text-align: center;
    cursor: pointer;
    transition: all .3s $ease-fluid;

    &--view {
      background: $cream-200;
      color: $ink-800;
      &:hover { background: $ink-900; color: $cream-50; }
    }
    &--edit {
      background: $cream-200;
      color: $ink-800;
      &:hover { background: $accent-caramel; color: $cream-50; }
    }
    &--delete {
      background: transparent;
      color: $danger;
      border: 1px solid rgba(178, 58, 42, 0.2);
      &:hover { background: $danger; color: $cream-50; }
    }
  }
}
</style>
