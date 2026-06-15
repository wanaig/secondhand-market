<template>
  <div class="cart">
    <div class="cart__container">
      <div class="cart__head">
        <span class="cart__eyebrow">CART · 购物车</span>
        <h1 class="cart__title">心动好物<em>，等你带走</em></h1>
        <p class="cart__sub">共 {{ cartStore.count }} 件商品 · 合计 ¥{{ cartStore.totalPrice }}</p>
      </div>

      <div v-if="cartStore.items.length" class="cart__main">
        <!-- 商品列表 -->
        <div class="cart__list">
          <div class="cart__list-head">
            <span class="cart__check-all">
              <input type="checkbox" :checked="allSelected" @change="toggleAll" />
              <label>全选 ({{ selectedIds.length }}/{{ cartStore.items.length }})</label>
            </span>
            <button class="cart__clear" @click="onClear">清空购物车</button>
          </div>

          <transition-group name="cart-item" tag="div" class="cart__items">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="cart-item"
              :class="{ 'cart-item--selected': selectedIds.includes(item.id) }"
            >
              <input
                type="checkbox"
                class="cart-item__check"
                :checked="selectedIds.includes(item.id)"
                @change="toggleSelect(item.id)"
              />
              <img :src="item.cover" :alt="item.title" class="cart-item__cover" @click="$router.push(`/items/${item.id}`)" />
              <div class="cart-item__info">
                <h3 @click="$router.push(`/items/${item.id}`)">{{ item.title }}</h3>
                <div class="cart-item__meta">
                  <span class="cart-item__cond">{{ item.condition }}</span>
                  <span class="cart-item__cat">{{ item.categoryName }}</span>
                </div>
                <div class="cart-item__seller">
                  <img :src="item.sellerAvatar" alt="" />
                  <span>{{ item.sellerName }}</span>
                </div>
              </div>
              <div class="cart-item__price">¥{{ item.price }}</div>
              <button class="cart-item__remove" @click="cartStore.removeItem(item.id)" aria-label="移除">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
          </transition-group>
        </div>

        <!-- 结算栏 -->
        <aside class="cart__summary">
          <div class="cart__summary-shell">
            <div class="cart__summary-inner">
              <h3>订单概要</h3>
              <div class="cart__summary-row">
                <span>已选商品</span>
                <strong>{{ selectedItems.length }} 件</strong>
              </div>
              <div class="cart__summary-row">
                <span>商品总价</span>
                <strong>¥{{ selectedTotal }}</strong>
              </div>
              <div class="cart__summary-row">
                <span>运费</span>
                <strong class="cart__free">面交免运</strong>
              </div>
              <div class="cart__summary-divider" />
              <div class="cart__summary-row cart__summary-row--total">
                <span>应付合计</span>
                <strong class="cart__total">¥{{ selectedTotal }}</strong>
              </div>
              <button class="cart__checkout" :disabled="!selectedItems.length" @click="onCheckout">
                <span>立即下单</span>
                <span class="cart__checkout-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17 17 7M9 7h8v8"/></svg>
                </span>
              </button>
              <p class="cart__hint">提交订单后将通知卖家，约定面交时间地点</p>
            </div>
          </div>
        </aside>
      </div>

      <!-- 空购物车 -->
      <EmptyState
        v-else
        title="购物车空空如也"
        desc="去浏览校园里的好物，把心仪的加入购物车吧"
      >
        <template #action>
          <button class="cart__go-btn" @click="$router.push('/items')">
            <span>去逛好物</span>
            <span class="cart__go-arrow">→</span>
          </button>
        </template>
      </EmptyState>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import EmptyState from '@/components/EmptyState.vue'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const selectedIds = ref(cartStore.items.map(i => i.id))

const selectedItems = computed(() =>
  cartStore.items.filter(i => selectedIds.value.includes(i.id))
)
const selectedTotal = computed(() =>
  selectedItems.value.reduce((s, i) => s + i.price, 0)
)
const allSelected = computed(() =>
  cartStore.items.length > 0 && selectedIds.value.length === cartStore.items.length
)

function toggleSelect(id) {
  const idx = selectedIds.value.indexOf(id)
  if (idx > -1) selectedIds.value.splice(idx, 1)
  else selectedIds.value.push(id)
}

function toggleAll(e) {
  selectedIds.value = e.target.checked ? cartStore.items.map(i => i.id) : []
}

async function onClear() {
  try {
    await ElMessageBox.confirm('确定清空购物车？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    cartStore.clear()
    selectedIds.value = []
    ElMessage.success('已清空购物车')
  } catch {}
}

function onCheckout() {
  if (!userStore.isLoggedIn) {
    userStore.openLoginDialog()
    return
  }
  if (!selectedItems.value.length) {
    ElMessage.warning('请先选择商品')
    return
  }
  // 把选中的 id 列表传到 checkout 页面
  router.push({
    path: '/checkout',
    query: { ids: selectedIds.value.join(',') }
  })
}
</script>

<style lang="scss" scoped>
.cart {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 32px 80px;

  &__head {
    margin-bottom: 40px;
  }

  &__eyebrow {
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

  &__title {
    font-family: $font-display;
    font-size: clamp(32px, 4vw, 52px);
    line-height: 1.1;
    color: $ink-900;
    margin-bottom: 8px;

    em { font-style: italic; color: $accent-caramel; }
  }

  &__sub {
    font-size: 14px;
    color: $ink-400;
    font-family: $font-mono;
  }

  &__main {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 32px;
    align-items: flex-start;
  }

  // —— 列表 ——
  &__list {
    padding: 24px;
    border-radius: $radius-xl;
    background: $cream-50;
    border: 1px solid rgba(20, 32, 26, 0.06);
    box-shadow: $shadow-soft;
  }

  &__list-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px solid $cream-300;
    margin-bottom: 16px;
  }

  &__check-all {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: $ink-600;
    font-weight: 500;

    input { width: 16px; height: 16px; cursor: pointer; accent-color: $ink-800; }
  }

  &__clear {
    font-size: 12px;
    color: $ink-400;
    cursor: pointer;
    transition: color .3s;

    &:hover { color: $danger; }
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  // —— 结算 ——
  &__summary {
    position: sticky;
    top: 110px;
  }

  &__summary-shell {
    padding: 4px;
    border-radius: $radius-xl;
    background: rgba(20, 32, 26, 0.06);
  }

  &__summary-inner {
    padding: 28px;
    border-radius: calc(#{$radius-xl} - 4px);
    background: $cream-50;
    box-shadow: $shadow-inner-light;

    h3 {
      font-family: $font-display;
      font-size: 20px;
      color: $ink-900;
      margin-bottom: 20px;
    }
  }

  &__summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    font-size: 13px;
    color: $ink-600;

    strong {
      font-weight: 600;
      color: $ink-900;
    }

    &--total {
      padding-top: 16px;
      strong { font-family: $font-display; font-size: 30px; }
    }
  }

  &__summary-divider {
    height: 1px;
    background: $cream-300;
    margin: 8px 0;
  }

  &__free {
    color: $accent-moss !important;
    font-size: 12px;
  }

  &__total {
    color: $accent-caramel !important;
  }

  &__checkout {
    width: 100%;
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 8px 8px 0;
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

    &:not(:disabled):hover {
      background: $accent-caramel;
      transform: translateY(-2px);
      .cart__checkout-arrow { background: $cream-50; color: $accent-caramel; transform: translate(2px, -2px); }
    }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
  }

  &__hint {
    font-size: 11px;
    color: $ink-300;
    text-align: center;
    margin-top: 12px;
  }

  &__go-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    border-radius: $radius-pill;
    background: $ink-900;
    color: $cream-50;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all .4s $ease-fluid;

    &:hover {
      background: $accent-caramel;
      transform: translateY(-2px);
      .cart__go-arrow { transform: translateX(4px); }
    }
  }

  &__go-arrow {
    transition: transform .3s $ease-fluid;
  }
}

// —— 单条商品 ——
.cart-item {
  display: grid;
  grid-template-columns: 24px 88px 1fr auto 32px;
  gap: 16px;
  align-items: center;
  padding: 14px;
  border-radius: $radius-md;
  background: $cream-100;
  transition: all .3s $ease-soft;

  &:hover { background: $cream-200; }
  &--selected { background: rgba(200, 99, 43, 0.06); }

  &__check {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: $accent-caramel;
  }

  &__cover {
    width: 88px;
    height: 88px;
    border-radius: $radius-sm;
    object-fit: cover;
    background: $cream-300;
    cursor: pointer;
  }

  &__info {
    h3 {
      font-size: 14px;
      font-weight: 600;
      color: $ink-900;
      margin-bottom: 6px;
      cursor: pointer;
      transition: color .3s;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;

      &:hover { color: $accent-caramel; }
    }
  }

  &__meta {
    display: flex;
    gap: 6px;
    margin-bottom: 6px;
  }

  &__cond {
    padding: 2px 8px;
    border-radius: $radius-pill;
    background: $cream-300;
    font-size: 10px;
    font-weight: 600;
    color: $ink-600;
  }

  &__cat {
    padding: 2px 8px;
    border-radius: $radius-pill;
    background: rgba(90, 122, 78, 0.12);
    font-size: 10px;
    color: $accent-moss;
  }

  &__seller {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: $ink-400;

    img {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: $cream-300;
    }
  }

  &__price {
    font-family: $font-display;
    font-size: 22px;
    color: $accent-caramel;
  }

  &__remove {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: transparent;
    color: $ink-400;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .3s $ease-fluid;
    cursor: pointer;

    svg { width: 14px; height: 14px; }

    &:hover {
      background: rgba(178, 58, 42, 0.1);
      color: $danger;
    }
  }
}

.cart-item-enter-active,
.cart-item-leave-active {
  transition: all .4s $ease-fluid;
}
.cart-item-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.cart-item-leave-to {
  opacity: 0;
  transform: translateX(20px);
  height: 0;
  padding: 0;
  margin: 0;
}

@media (max-width: 1024px) {
  .cart__main { grid-template-columns: 1fr; }
  .cart__summary { position: static; }
}
@media (max-width: 768px) {
  .cart { padding: 24px 16px 48px; }
  .cart-item {
    grid-template-columns: 24px 64px 1fr 32px;
    grid-template-rows: auto auto;

    &__price {
      grid-column: 3 / 4;
      grid-row: 2;
      justify-self: end;
      font-size: 18px;
    }
    &__remove {
      grid-row: 1;
      grid-column: 4;
    }
  }
}
</style>
