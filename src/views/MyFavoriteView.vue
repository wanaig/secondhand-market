<template>
  <div class="my-favorite">
    <div class="my-favorite__head">
      <h2>我的收藏</h2>
      <span class="my-favorite__count">{{ favStore.count }} 件</span>
    </div>

    <div v-if="favStore.list.length" class="my-favorite__grid">
      <ItemCard
        v-for="item in favStore.list"
        :key="item.id"
        :item="item"
      />
    </div>

    <EmptyState v-else title="还没有收藏好物" desc="逛逛好物，点击爱心收藏心仪的商品" />
  </div>
</template>

<script setup>
import { useFavoriteStore } from '@/stores/favorite'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'

const favStore = useFavoriteStore()
</script>

<style lang="scss" scoped>
.my-favorite {
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

  &__count {
    padding: 4px 12px;
    border-radius: $radius-pill;
    background: $cream-200;
    font-size: 12px;
    font-weight: 600;
    color: $ink-600;
    font-family: $font-mono;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .my-favorite__grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
