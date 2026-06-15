<template>
  <div class="category-filter">
    <div class="category-filter__label">分类</div>
    <div class="category-filter__list">
      <button
        v-for="c in categories"
        :key="c.key"
        class="category-filter__item"
        :class="{ 'category-filter__item--active': modelValue === c.key }"
        @click="select(c.key)"
      >
        <span class="category-filter__item-icon">{{ c.icon }}</span>
        {{ c.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { categories } from '@/mock'

const props = defineProps({
  modelValue: { type: String, default: 'all' }
})
const emit = defineEmits(['update:modelValue'])

function select(key) {
  emit('update:modelValue', key)
}
</script>

<style lang="scss" scoped>
.category-filter {
  &__label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: $ink-400;
    margin-bottom: 12px;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: $radius-pill;
    background: $cream-200;
    font-size: 13px;
    font-weight: 500;
    color: $ink-600;
    cursor: pointer;
    transition: all .35s $ease-fluid;

    &-icon {
      font-family: $font-mono;
      font-size: 10px;
      color: $accent-caramel;
    }

    &:hover {
      background: $cream-300;
      transform: translateY(-2px);
    }

    &--active {
      background: $ink-900;
      color: $cream-50;

      .category-filter__item-icon { color: $accent-caramel; }

      &:hover {
        background: $ink-900;
        transform: translateY(-2px);
      }
    }
  }
}
</style>
