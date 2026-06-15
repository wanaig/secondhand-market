<template>
  <div class="home">
    <!-- HERO 区 - Editorial Split Layout -->
    <section class="hero">
      <div class="hero__inner">
        <div class="hero__left">
          <div class="hero__eyebrow">
            <span class="hero__dot"></span>
            <span>CAMPUS · SECONDHAND · EST.2025</span>
          </div>
          <h1 class="hero__title">
            让校园里的<br />
            <span class="hero__title-italic">每一件好物</span>，<br />
            重新流转 <span class="hero__title-mark">↗</span>
          </h1>
          <p class="hero__desc">
            拾光集 · GleanCampus —— 一个为校园学生打造的二手物品交易空间。<br />
            书籍、数码、生活用品，让闲置物品找到下一个珍惜它的同学。
          </p>
          <div class="hero__actions">
            <button class="hero__cta" @click="$router.push('/items')">
              <span>开始逛逛</span>
              <span class="hero__cta-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17 17 7M9 7h8v8"/></svg>
              </span>
            </button>
            <button class="hero__cta hero__cta--ghost" @click="goPublish">
              <span>发布我的好物</span>
            </button>
          </div>

          <div class="hero__stats">
            <div class="hero__stat">
              <strong>30<sup>+</sup></strong>
              <span>活跃好物</span>
            </div>
            <div class="hero__stat">
              <strong>5</strong>
              <span>校区覆盖</span>
            </div>
            <div class="hero__stat">
              <strong>6</strong>
              <span>商品分类</span>
            </div>
          </div>
        </div>

        <!-- HERO 右侧 - 不规则 Bento -->
        <div class="hero__right">
          <div class="hero-card hero-card--big" v-if="hot[0]" @click="$router.push(`/items/${hot[0].id}`)">
            <img :src="hot[0].cover" :alt="hot[0].title" />
            <div class="hero-card__overlay">
              <span class="hero-card__tag">本周热门</span>
              <h3>{{ hot[0].title }}</h3>
              <div class="hero-card__price">¥{{ hot[0].price }}</div>
            </div>
          </div>
          <div class="hero-card hero-card--small" v-if="hot[1]" @click="$router.push(`/items/${hot[1].id}`)">
            <img :src="hot[1].cover" :alt="hot[1].title" />
            <div class="hero-card__overlay hero-card__overlay--top">
              <span class="hero-card__tag hero-card__tag--cream">{{ hot[1].condition }}</span>
            </div>
            <div class="hero-card__overlay">
              <h3>{{ hot[1].title }}</h3>
              <div class="hero-card__price">¥{{ hot[1].price }}</div>
            </div>
          </div>
          <div class="hero-card hero-card--smaller" v-if="hot[2]" @click="$router.push(`/items/${hot[2].id}`)">
            <img :src="hot[2].cover" :alt="hot[2].title" />
            <div class="hero-card__overlay">
              <h3>{{ hot[2].title }}</h3>
              <div class="hero-card__price">¥{{ hot[2].price }}</div>
            </div>
          </div>
          <div class="hero-card hero-card--note">
            <div class="hero-card__note">
              <span class="hero-card__note-quote">“</span>
              <p>校园里的旧物，<br />从未真正失去价值。</p>
              <span class="hero-card__note-sig">— GleanCampus</span>
            </div>
          </div>
        </div>
      </div>

      <div class="hero__marquee">
        <div class="hero__marquee-track">
          <span v-for="(t, i) in marqueeText" :key="i">{{ t }}</span>
          <span v-for="(t, i) in marqueeText" :key="'r' + i">{{ t }}</span>
        </div>
      </div>
    </section>

    <!-- 分类导航区 -->
    <section class="categories">
      <div class="section-head">
        <div class="section-head__left">
          <span class="section-eyebrow">CATEGORIES · 浏览分类</span>
          <h2 class="section-title">挑选你感兴趣的<br /><em>类别开始探索</em></h2>
        </div>
        <router-link to="/items" class="section-head__more">
          <span>全部好物</span>
          <span class="section-head__arrow">→</span>
        </router-link>
      </div>

      <div class="categories__grid">
        <router-link
          v-for="(c, i) in categoryList"
          :key="c.key"
          :to="`/category/${c.key}`"
          class="cat-card"
          :class="{ 'cat-card--feature': i === 0 }"
        >
          <div class="cat-card__inner">
            <span class="cat-card__icon">{{ c.icon }}</span>
            <h3 class="cat-card__name">{{ c.name }}</h3>
            <p class="cat-card__sub">{{ c.sub.join(' · ') }}</p>
            <span class="cat-card__arrow">→</span>
          </div>
        </router-link>
      </div>
    </section>

    <!-- 最新发布 - Bento 网格 -->
    <section class="latest">
      <div class="section-head">
        <div class="section-head__left">
          <span class="section-eyebrow">LATEST · 最新上架</span>
          <h2 class="section-title">刚刚上线的<br /><em>校园好物</em></h2>
        </div>
        <div class="latest__filters">
          <button
            v-for="c in quickCats"
            :key="c.key"
            class="latest__filter"
            :class="{ 'latest__filter--active': activeCategory === c.key }"
            @click="activeCategory = c.key; loadLatest()"
          >{{ c.name }}</button>
        </div>
      </div>

      <div class="latest__grid">
        <transition-group name="card" tag="div" class="card-group">
          <ItemCard
            v-for="item in latestItems"
            :key="item.id"
            :item="item"
          />
        </transition-group>
      </div>

      <div class="latest__more">
        <router-link to="/items" class="latest__more-btn">
          <span>查看全部好物</span>
          <span class="latest__more-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17 17 7M9 7h8v8"/></svg>
          </span>
        </router-link>
      </div>
    </section>

    <!-- 价值主张 - 三列 -->
    <section class="values">
      <div class="values__head">
        <span class="section-eyebrow">WHY GLEAN · 为什么选择拾光集</span>
        <h2 class="section-title section-title--center">
          不是简单的二手交易<br />
          <em>是校园里的可持续生活</em>
        </h2>
      </div>
      <div class="values__grid">
        <div class="value-card">
          <div class="value-card__num">01</div>
          <h3>校园即时面交</h3>
          <p>同校直接见面，不用快递不用等待。<br />宿舍楼下、食堂门口，一杯咖啡时间完成交易。</p>
        </div>
        <div class="value-card value-card--accent">
          <div class="value-card__num">02</div>
          <h3>真实身份认证</h3>
          <p>校园账号实名验证，每一位卖家都是你身边的同学。<br />更安全、更可靠、更值得信赖。</p>
        </div>
        <div class="value-card">
          <div class="value-card__num">03</div>
          <h3>让闲置重新发光</h3>
          <p>把闲置变成下一个同学的宝贝。<br />省钱、省心，也对地球更友好的生活方式。</p>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="cta-banner">
      <div class="cta-banner__inner">
        <div class="cta-banner__bg-text">SHARE · GLEAN · CIRCULATE</div>
        <h2 class="cta-banner__title">
          准备好<br />
          <em>分享你的好物了吗？</em>
        </h2>
        <p class="cta-banner__desc">三步发布，让闲置在校园里找到新主人</p>
        <button class="cta-banner__btn" @click="goPublish">
          <span>立即发布</span>
          <span class="cta-banner__arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17 17 7M9 7h8v8"/></svg>
          </span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getItems } from '@/api/item'
import { useUserStore } from '@/stores/user'
import { categories } from '@/mock'
import ItemCard from '@/components/ItemCard.vue'

const router = useRouter()
const userStore = useUserStore()

const hot = ref([])
const latestItems = ref([])
const activeCategory = ref('all')

const categoryList = computed(() => categories)
const quickCats = computed(() => [{ key: 'all', name: '全部' }, ...categories])

const marqueeText = [
  '✦ 拾光集 / GLEAN CAMPUS',
  '· 让闲置物品再次流转 ·',
  '✦ 校园 · 二手 · 可持续',
  '· 同学之间的诚信交易 ·',
  '✦ EST. 2025 / 秋'
]

async function loadHot() {
  const res = await getItems({ sort: 'hot', size: 4 })
  hot.value = res.data.list
}

async function loadLatest() {
  const params = { sort: 'latest', size: 8 }
  if (activeCategory.value !== 'all') params.category = activeCategory.value
  const res = await getItems(params)
  latestItems.value = res.data.list
}

function goPublish() {
  if (!userStore.isLoggedIn) {
    userStore.openLoginDialog()
    return
  }
  router.push('/publish')
}

onMounted(() => {
  loadHot()
  loadLatest()
})
</script>

<style lang="scss" scoped>
.home {
  padding-top: 24px;
}

// ========== HERO ==========
.hero {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 32px 80px;

  &__inner {
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    gap: 64px;
    align-items: stretch;
  }

  &__left {
    padding: 32px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: $radius-pill;
    background: $cream-200;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: $ink-600;
    width: max-content;
    margin-bottom: 24px;

    .hero__dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: $accent-caramel;
      box-shadow: 0 0 8px rgba(200, 99, 43, 0.6);
      animation: pulse 2s $ease-soft infinite;
    }
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(48px, 6vw, 84px);
    line-height: 1.05;
    letter-spacing: -0.03em;
    color: $ink-900;
    margin-bottom: 28px;

    &-italic {
      font-style: italic;
      color: $accent-caramel;
    }

    &-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: $ink-900;
      color: $cream-50;
      font-size: 32px;
      font-style: normal;
      transform: rotate(-6deg) translateY(-6px);
      vertical-align: middle;
      transition: transform .5s $ease-spring;
    }
    &-mark:hover {
      transform: rotate(0deg) translateY(-6px);
    }
  }

  &__desc {
    font-size: 16px;
    line-height: 1.7;
    color: $ink-600;
    margin-bottom: 32px;
    max-width: 520px;
  }

  &__actions {
    display: flex;
    gap: 12px;
    margin-bottom: 56px;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 8px 8px 8px 28px;
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
    }
    &:hover &-arrow {
      background: $cream-50;
      color: $accent-caramel;
      transform: translate(2px, -2px);
    }
    &:active { transform: scale(0.97); }

    &--ghost {
      background: transparent;
      color: $ink-900;
      border: 1.5px solid $ink-800;
      padding: 14px 24px;

      &:hover {
        background: $ink-900;
        color: $cream-50;
        border-color: $ink-900;
      }
    }
  }

  &__stats {
    display: flex;
    gap: 48px;
    padding-top: 32px;
    border-top: 1px solid $cream-300;
  }

  &__stat {
    strong {
      display: block;
      font-family: $font-display;
      font-size: 38px;
      color: $ink-900;
      line-height: 1;

      sup {
        font-size: 18px;
        color: $accent-caramel;
      }
    }
    span {
      font-size: 11px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: $ink-400;
      margin-top: 4px;
      display: inline-block;
    }
  }

  // 右侧 Bento
  &__right {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1.4fr 1fr;
    gap: 16px;
    min-height: 600px;
  }

  &__marquee {
    margin-top: 48px;
    overflow: hidden;
    border-top: 1px solid $cream-300;
    border-bottom: 1px solid $cream-300;
    padding: 16px 0;
    background: $cream-50;

    &-track {
      display: flex;
      gap: 32px;
      white-space: nowrap;
      animation: marquee 30s linear infinite;

      span {
        font-family: $font-display;
        font-style: italic;
        font-size: 22px;
        color: $ink-800;
        flex-shrink: 0;
      }
    }
  }
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

// HERO 卡片
.hero-card {
  position: relative;
  border-radius: $radius-xl;
  overflow: hidden;
  cursor: pointer;
  transition: all .5s $ease-fluid;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform .8s $ease-fluid;
  }

  &:hover img { transform: scale(1.06); }
  &:hover { transform: translateY(-4px); box-shadow: $shadow-medium; }

  &--big {
    grid-column: span 2;
    grid-row: span 1;
  }

  &--small {
    grid-column: span 1;
    grid-row: span 1;
  }

  &--smaller {
    grid-column: span 1;
    grid-row: span 1;
  }

  &--note {
    grid-column: span 1;
    background: $ink-900;
    color: $cream-100;
    padding: 24px;
    display: flex;
    align-items: flex-end;

    &:hover { transform: none; }
    &:hover img { transform: none; }
  }

  &__overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px 18px;
    background: linear-gradient(to top, rgba(20,32,26,0.85), rgba(20,32,26,0));

    &--top {
      top: 0;
      bottom: auto;
      background: none;
      padding: 14px;
      text-align: right;
    }

    h3 {
      color: $cream-50;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.4;
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  &__tag {
    display: inline-block;
    padding: 4px 10px;
    border-radius: $radius-pill;
    background: $accent-caramel;
    color: $cream-50;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.05em;
    margin-bottom: 8px;

    &--cream {
      background: rgba(253, 251, 246, 0.85);
      color: $ink-800;
      backdrop-filter: blur(6px);
    }
  }

  &__price {
    font-family: $font-display;
    font-size: 22px;
    color: $cream-50;
  }

  &__note {
    p {
      font-family: $font-display;
      font-size: 18px;
      line-height: 1.5;
      margin: 14px 0;
      color: $cream-50;
    }
    &-quote {
      font-family: $font-display;
      font-size: 60px;
      line-height: 0.5;
      color: $accent-caramel;
      display: block;
    }
    &-sig {
      font-size: 11px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: $cream-400;
    }
  }
}

// ========== Section Head ==========
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 48px;
  flex-wrap: wrap;
  gap: 16px;

  &__more {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 22px;
    border-radius: $radius-pill;
    background: $cream-200;
    color: $ink-800;
    font-size: 13px;
    font-weight: 600;
    transition: all .35s $ease-fluid;

    &:hover {
      background: $ink-900;
      color: $cream-50;
      .section-head__arrow { transform: translateX(4px); }
    }
  }

  &__arrow {
    transition: transform .3s $ease-fluid;
  }
}

.section-eyebrow {
  display: inline-block;
  padding: 5px 12px;
  border-radius: $radius-pill;
  background: $cream-200;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: $accent-caramel;
  margin-bottom: 14px;
}

.section-title {
  font-family: $font-display;
  font-size: clamp(32px, 4vw, 48px);
  line-height: 1.1;
  color: $ink-900;
  letter-spacing: -0.02em;

  em {
    font-style: italic;
    color: $accent-caramel;
  }

  &--center {
    text-align: center;
  }
}

// ========== 分类卡 ==========
.categories {
  max-width: 1440px;
  margin: 0 auto;
  padding: 80px 32px;
}

.categories__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.cat-card {
  position: relative;
  overflow: hidden;
  border-radius: $radius-xl;
  background: $cream-200;
  transition: all .5s $ease-fluid;
  cursor: pointer;
  aspect-ratio: 16 / 9;

  &:hover {
    transform: translateY(-6px);
    box-shadow: $shadow-medium;

    .cat-card__icon { transform: scale(1.15); color: $accent-caramel; }
    .cat-card__arrow { transform: translateX(8px) rotate(-45deg); }
  }

  &--feature {
    grid-column: span 2;
    aspect-ratio: 32 / 9;
    background: $ink-900;

    .cat-card__name { color: $cream-50; }
    .cat-card__sub { color: $cream-400; }
    .cat-card__icon { color: $accent-caramel; }
    .cat-card__arrow { color: $cream-50; }
  }

  &__inner {
    padding: 28px 32px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }

  &__icon {
    font-family: $font-mono;
    font-size: 14px;
    letter-spacing: 0.1em;
    color: $accent-caramel;
    transition: all .5s $ease-spring;
  }

  &__name {
    font-family: $font-display;
    font-size: 28px;
    color: $ink-900;
    margin-bottom: 6px;
  }

  &__sub {
    font-size: 12px;
    color: $ink-400;
    letter-spacing: 0.05em;
  }

  &__arrow {
    position: absolute;
    bottom: 28px;
    right: 32px;
    font-size: 22px;
    color: $ink-600;
    transition: transform .5s $ease-fluid;
  }
}

// ========== 最新上架 ==========
.latest {
  max-width: 1440px;
  margin: 0 auto;
  padding: 60px 32px 80px;

  &__filters {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  &__filter {
    padding: 7px 14px;
    border-radius: $radius-pill;
    background: $cream-200;
    font-size: 12px;
    color: $ink-600;
    font-weight: 500;
    cursor: pointer;
    transition: all .3s $ease-fluid;

    &--active {
      background: $ink-900;
      color: $cream-50;
    }
    &:hover:not(&--active) {
      background: $cream-300;
    }
  }

  &__grid {
    .card-group {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
  }

  &__more {
    text-align: center;
    margin-top: 56px;
  }
  &__more-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 10px 8px 10px 30px;
    border-radius: $radius-pill;
    background: $ink-900;
    color: $cream-50;
    font-size: 14px;
    font-weight: 600;
    transition: all .4s $ease-fluid;
  }
  &__more-arrow {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: $accent-caramel;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    svg { width: 16px; height: 16px; }
  }
  &__more-btn:hover {
    background: $accent-caramel;
    transform: translateY(-2px);

    .latest__more-arrow {
      background: $cream-50;
      color: $accent-caramel;
      transform: translate(2px, -2px);
    }
  }
}

.card-enter-active,
.card-leave-active {
  transition: all .5s $ease-fluid;
}
.card-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.card-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

// ========== 价值主张 ==========
.values {
  max-width: 1280px;
  margin: 0 auto;
  padding: 80px 32px;
  text-align: center;

  &__head {
    margin-bottom: 56px;

    .section-eyebrow {
      margin-bottom: 16px;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    text-align: left;
  }
}

.value-card {
  padding: 36px 32px;
  border-radius: $radius-xl;
  background: $cream-200;
  transition: all .5s $ease-fluid;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-6px);
    background: $cream-50;
    box-shadow: $shadow-medium;

    .value-card__num {
      color: $accent-caramel;
      letter-spacing: 0.1em;
    }
  }

  &--accent {
    background: $ink-900;
    color: $cream-200;

    h3 { color: $cream-50; }
    p { color: $cream-400; }
    .value-card__num { color: $accent-caramel; }

    &:hover {
      background: $ink-900;
      transform: translateY(-6px) scale(1.02);
    }
  }

  &__num {
    font-family: $font-mono;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: $ink-300;
    margin-bottom: 24px;
    transition: all .5s $ease-fluid;
  }

  h3 {
    font-family: $font-display;
    font-size: 26px;
    color: $ink-900;
    margin-bottom: 12px;
  }

  p {
    font-size: 13px;
    line-height: 1.7;
    color: $ink-600;
  }
}

// ========== CTA Banner ==========
.cta-banner {
  max-width: 1440px;
  margin: 0 auto 80px;
  padding: 0 32px;

  &__inner {
    position: relative;
    padding: 96px 64px;
    border-radius: $radius-xl;
    background: $ink-900;
    color: $cream-50;
    overflow: hidden;
    text-align: center;

    &::before {
      content: '';
      position: absolute;
      top: -100px;
      right: -100px;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(200, 99, 43, 0.3), transparent 70%);
      pointer-events: none;
    }
  }

  &__bg-text {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: $font-display;
    font-style: italic;
    font-size: clamp(60px, 12vw, 180px);
    color: rgba(253, 251, 246, 0.04);
    letter-spacing: -0.04em;
    pointer-events: none;
    white-space: nowrap;
    overflow: hidden;
  }

  &__title {
    position: relative;
    font-family: $font-display;
    font-size: clamp(40px, 5vw, 64px);
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 16px;

    em {
      font-style: italic;
      color: $accent-caramel;
    }
  }

  &__desc {
    position: relative;
    font-size: 14px;
    color: $cream-400;
    margin-bottom: 32px;
  }

  &__btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 8px 8px 8px 28px;
    border-radius: $radius-pill;
    background: $cream-50;
    color: $ink-900;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all .4s $ease-fluid;
  }
  &__arrow {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: $accent-caramel;
    color: $cream-50;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    svg { width: 16px; height: 16px; }
  }
  &__btn:hover {
    background: $accent-caramel;
    color: $cream-50;
    transform: translateY(-2px);

    .cta-banner__arrow {
      background: $cream-50;
      color: $accent-caramel;
      transform: translate(2px, -2px);
    }
  }
}

// ========== 响应式 ==========
@media (max-width: 1024px) {
  .hero__inner {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  .hero__right {
    min-height: 480px;
  }
  .categories__grid {
    grid-template-columns: 1fr 1fr;
  }
  .cat-card--feature {
    grid-column: span 2;
    aspect-ratio: 16 / 9;
  }
  .latest__grid .card-group {
    grid-template-columns: repeat(3, 1fr);
  }
  .values__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 24px 16px 48px;
  }
  .hero__title {
    font-size: 44px;
  }
  .hero__title-mark {
    width: 44px;
    height: 44px;
    font-size: 22px;
  }
  .hero__stats {
    gap: 24px;
  }
  .hero__right {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
    min-height: auto;
  }
  .hero-card--big { grid-column: span 2; aspect-ratio: 16 / 10; }

  .categories, .latest, .values { padding: 48px 16px; }
  .categories__grid {
    grid-template-columns: 1fr;
  }
  .cat-card--feature, .cat-card {
    grid-column: span 1;
    aspect-ratio: 16 / 9;
  }
  .latest__grid .card-group {
    grid-template-columns: 1fr 1fr;
  }
  .cta-banner__inner {
    padding: 64px 24px;
  }
}
</style>
