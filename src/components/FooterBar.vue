<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <div class="footer__logo">
          <span class="footer__logo-mark">G</span>
          <div>
            <div class="footer__logo-cn">拾光集</div>
            <div class="footer__logo-en">Campus Secondhand / Est.2026</div>
          </div>
        </div>
        <p class="footer__desc">
          让闲置好物重新发光，<br />校园二手交易的文艺方式。
        </p>
      </div>
      <div class="footer__cols">
        <div class="footer__col">
          <h4>浏览</h4>
          <router-link to="/items">全部好物</router-link>
          <router-link to="/category/books">教材书籍</router-link>
          <router-link to="/category/digital">数码电子</router-link>
          <router-link to="/category/fashion">服饰鞋包</router-link>
        </div>
        <div class="footer__col">
          <h4>关于</h4>
          <a href="javascript:;">使用指南</a>
          <a href="javascript:;">安全交易</a>
          <a href="javascript:;">联系我们</a>
        </div>
        <div class="footer__col">
          <h4>社区</h4>
          <a href="javascript:;">校园公告</a>
          <a href="javascript:;">反馈建议</a>
          <a href="javascript:;">加入我们</a>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© 2026 GleanCampus · 拾光集 — 校园二手交易平台</span>
        <span class="footer__divider">·</span>
        <span>Made with <i class="footer__heart">♥</i> for Campus Life</span>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background: $ink-900;
  color: $cream-300;
  padding: 72px 32px 40px;

  &__inner {
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.2fr 2fr;
    gap: 64px;
  }

  &__brand {
    padding-right: 32px;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;

    &-mark {
      width: 44px;
      height: 44px;
      border-radius: $radius-md;
      background: $accent-caramel;
      color: $cream-50;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: $font-display;
      font-size: 24px;
      font-style: italic;
      transform: rotate(-6deg);
    }
    &-cn {
      font-family: $font-display;
      font-size: 22px;
      color: $cream-50;
    }
    &-en {
      font-size: 9px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: $ink-400;
    }
  }

  &__desc {
    font-size: 14px;
    line-height: 1.8;
    color: $ink-400;
  }

  &__cols {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }

  &__col {
    h4 {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: $cream-400;
      margin-bottom: 16px;
    }
    a {
      display: block;
      padding: 6px 0;
      font-size: 13px;
      color: $ink-300;
      transition: color .3s $ease-soft;

      &:hover {
        color: $accent-caramel;
      }
    }
  }

  &__bottom {
    grid-column: 1 / -1;
    padding-top: 40px;
    border-top: 1px solid rgba(255,255,255,0.06);
    font-size: 12px;
    color: $ink-400;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__heart {
    font-style: normal;
    color: $accent-caramel;
  }

  &__divider {
    color: $ink-600;
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 48px 20px 32px;
    &__inner {
      grid-template-columns: 1fr;
      gap: 40px;
    }
    &__cols {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
