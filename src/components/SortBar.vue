<template>
  <div class="sort-bar">
    <div class="sort-bar__label">排序方式</div>
    <div class="sort-bar__group">
      <button
        v-for="o in options"
        :key="o.value"
        class="sort-bar__btn"
        :class="{ 'sort-bar__btn--active': modelValue === o.value }"
        @click="$emit('update:modelValue', o.value)"
      >
        <span>{{ o.label }}</span>
        <span v-if="o.icon" class="sort-bar__icon">{{ o.icon }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({ modelValue: { type: String, default: 'latest' } })
defineEmits(['update:modelValue'])

const options = [
  { value: 'latest',     label: '最新发布',  icon: '✦' },
  { value: 'priceAsc',   label: '价格升序',  icon: '↑' },
  { value: 'priceDesc',  label: '价格降序',  icon: '↓' },
  { value: 'hot',        label: '人气最高',  icon: '★' }
]
</script>

<style lang="scss" scoped>
.sort-bar {
  display: flex;
  align-items: center;
  gap: 14px;

  &__label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: $ink-400;
  }

  &__group {
    display: flex;
    gap: 4px;
    padding: 4px;
    background: $cream-200;
    border-radius: $radius-pill;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 600;
    color: $ink-600;
    border-radius: $radius-pill;
    transition: all .35s $ease-fluid;

    &--active {
      background: $cream-50;
      color: $ink-900;
      box-shadow: $shadow-soft;
    }
    &:hover:not(&--active) { color: $ink-900; }
  }

  &__icon {
    font-size: 10px;
    color: $accent-caramel;
  }
}
</style>
