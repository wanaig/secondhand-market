<template>
  <div class="seller-card">
    <div class="seller-card__top">
      <img :src="seller.avatar" :alt="seller.name" class="seller-card__avatar" />
      <div class="seller-card__info">
        <h4 class="seller-card__name">{{ seller.name }}</h4>
        <span class="seller-card__campus">{{ seller.campus }}</span>
      </div>
      <div class="seller-card__tag">
        <span>已认证</span>
      </div>
    </div>
    <div class="seller-card__bottom">
      <div class="seller-card__stat">
        <strong>{{ seller.publishedCount || Math.floor(Math.random() * 10 + 1) }}</strong>
        <span>在售</span>
      </div>
      <div class="seller-card__stat">
        <strong>{{ seller.soldCount || Math.floor(Math.random() * 20 + 5) }}</strong>
        <span>已出</span>
      </div>
      <button class="seller-card__contact" @click="$emit('contact')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
          <path d="M21 12c0 4-4 7-9 7-1.2 0-2.4-.2-3.5-.5L4 20l1.5-4C4 14.8 3 13.5 3 12c0-4 4-7 9-7s9 3 9 7Z"/>
        </svg>
        <span>联系卖家</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  seller: {
    type: Object,
    required: true,
    default: () => ({ name: '', avatar: '', campus: '' })
  }
})
defineEmits(['contact'])
</script>

<style lang="scss" scoped>
.seller-card {
  padding: 20px;
  border-radius: $radius-lg;
  background: $cream-100;
  border: 1px solid rgba(20, 32, 26, 0.05);

  &__top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  &__avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: $cream-300;
    object-fit: cover;
  }

  &__info {
    flex: 1;
  }

  &__name {
    font-size: 15px;
    font-weight: 600;
    color: $ink-900;
    margin-bottom: 2px;
  }

  &__campus {
    font-size: 12px;
    color: $ink-400;
  }

  &__tag {
    padding: 4px 10px;
    border-radius: $radius-pill;
    background: rgba(90, 122, 78, 0.1);
    color: $accent-moss;
    font-size: 11px;
    font-weight: 600;
  }

  &__bottom {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 14px;

    strong {
      font-size: 18px;
      font-weight: 700;
      color: $ink-900;
      font-family: $font-display;
    }
    span {
      font-size: 11px;
      color: $ink-400;
    }
  }

  &__contact {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    border-radius: $radius-pill;
    background: $ink-900;
    color: $cream-50;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all .35s $ease-fluid;

    &:hover {
      background: $accent-caramel;
      transform: translateY(-1px);
    }
    &:active {
      transform: scale(0.97);
    }
  }
}
</style>
