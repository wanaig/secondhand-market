<template>
  <div class="not-found">
    <div class="not-found__inner">
      <div class="not-found__code">404</div>
      <h1 class="not-found__title">页面走丢了</h1>
      <p class="not-found__desc">你访问的页面不存在，可能已被下架或链接有误。</p>
      <div class="not-found__actions">
        <router-link to="/" class="not-found__btn not-found__btn--primary">回到首页</router-link>
        <router-link to="/items" class="not-found__btn">浏览好物</router-link>
      </div>
      <div class="not-found__illustration">
        <span class="not-found__ghost">◎</span>
        <span class="not-found__ghost not-found__ghost--2">◎</span>
        <span class="not-found__ghost not-found__ghost--3">◎</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 48px 32px;

  &__inner {
    text-align: center;
    max-width: 480px;
    position: relative;
  }

  &__code {
    font-family: $font-display;
    font-size: 140px;
    line-height: 1;
    color: $cream-300;
    margin-bottom: -20px;
  }

  &__title {
    font-family: $font-display;
    font-size: 36px;
    color: $ink-900;
    margin-bottom: 12px;
  }

  &__desc {
    font-size: 14px;
    color: $ink-400;
    margin-bottom: 36px;
    line-height: 1.7;
  }

  &__actions {
    display: flex;
    justify-content: center;
    gap: 12px;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    padding: 12px 28px;
    border-radius: $radius-pill;
    font-size: 14px;
    font-weight: 600;
    transition: all .35s $ease-fluid;

    &--primary {
      background: $ink-900;
      color: $cream-50;

      &:hover { background: $accent-caramel; transform: translateY(-2px); }
    }
    &:not(&--primary) {
      border: 1.5px solid $ink-800;
      color: $ink-800;

      &:hover { background: $ink-900; color: $cream-50; }
    }
  }

  &__illustration {
    margin-top: 56px;
    display: flex;
    justify-content: center;
    gap: 24px;
  }

  &__ghost {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: $cream-300;
    display: block;
    animation: float 3s $ease-fluid infinite;

    &--2 { animation-delay: 0.6s; background: $accent-caramel; opacity: 0.5; }
    &--3 { animation-delay: 1.2s; background: $ink-800; opacity: 0.3; }
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
</style>
