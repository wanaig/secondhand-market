<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <slot name="icon">
        <svg viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="36" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4"/>
          <path d="M30 38h20M40 28v20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </slot>
    </div>
    <h3 class="empty-state__title">{{ title }}</h3>
    <p class="empty-state__desc" v-if="desc">{{ desc }}</p>
    <slot name="action" />
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '暂无内容' },
  desc: { type: String, default: '' }
})
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 24px;
  text-align: center;

  &__icon {
    margin-bottom: 24px;
    color: $cream-400;

    svg {
      width: 80px;
      height: 80px;
    }
  }

  &__title {
    font-family: $font-display;
    font-size: 22px;
    color: $ink-600;
    margin-bottom: 8px;
  }

  &__desc {
    font-size: 14px;
    color: $ink-300;
    max-width: 320px;
    line-height: 1.6;
  }
}
</style>
