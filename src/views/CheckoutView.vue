<template>
  <div class="checkout">
    <div class="checkout__container">
      <div class="checkout__head">
        <span class="checkout__eyebrow">CHECKOUT · 确认订单</span>
        <h1 class="checkout__title">最后一步，<em>确认订单信息</em></h1>
      </div>

      <div v-if="items.length" class="checkout__main">
        <div class="checkout__form">
          <!-- 收货 / 面交方式 -->
          <section class="checkout-card">
            <div class="checkout-card__head">
              <h3>交易方式</h3>
            </div>
            <div class="checkout-card__body">
              <div class="checkout__methods">
                <button
                  v-for="m in methods"
                  :key="m.key"
                  class="checkout__method"
                  :class="{ 'checkout__method--active': form.method === m.key }"
                  @click="form.method = m.key"
                >
                  <span class="checkout__method-icon">{{ m.icon }}</span>
                  <div>
                    <div class="checkout__method-name">{{ m.name }}</div>
                    <div class="checkout__method-desc">{{ m.desc }}</div>
                  </div>
                </button>
              </div>
            </div>
          </section>

          <!-- 联系信息 -->
          <section class="checkout-card">
            <div class="checkout-card__head">
              <h3>联系信息</h3>
            </div>
            <div class="checkout-card__body">
              <div class="checkout__field-row">
                <div class="checkout__field">
                  <label>买家昵称</label>
                  <input :value="userStore.currentUser?.nickname" type="text" readonly />
                </div>
                <div class="checkout__field">
                  <label>所在校区</label>
                  <input v-model="form.campus" type="text" placeholder="例：东校区" />
                </div>
              </div>
              <div class="checkout__field">
                <label>{{ form.method === 'meet' ? '约定地点' : '收货地址' }}</label>
                <input
                  v-model="form.address"
                  type="text"
                  :placeholder="form.method === 'meet' ? '例：东校区图书馆门口' : '请输入详细地址'"
                />
              </div>
              <div class="checkout__field">
                <label>联系电话</label>
                <input v-model="form.phone" type="tel" placeholder="便于卖家联系你" />
              </div>
              <div class="checkout__field">
                <label>备注（选填）</label>
                <textarea
                  v-model="form.note"
                  rows="3"
                  placeholder="想要约定时间或者特殊说明，可以写在这里"
                  maxlength="200"
                ></textarea>
              </div>
            </div>
          </section>

          <!-- 商品清单 -->
          <section class="checkout-card">
            <div class="checkout-card__head">
              <h3>商品清单 <span class="checkout-card__count">{{ items.length }} 件</span></h3>
            </div>
            <div class="checkout-card__body">
              <div class="checkout__items">
                <div v-for="i in items" :key="i.id" class="checkout-item">
                  <img :src="i.cover" :alt="i.title" />
                  <div class="checkout-item__info">
                    <h4>{{ i.title }}</h4>
                    <div class="checkout-item__meta">
                      <span class="checkout-item__cond">{{ i.condition }}</span>
                      <span class="checkout-item__cat">{{ i.categoryName }}</span>
                    </div>
                    <div class="checkout-item__seller">
                      卖家：{{ i.sellerName }}
                    </div>
                  </div>
                  <div class="checkout-item__price">¥{{ i.price }}</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- 右侧汇总栏 -->
        <aside class="checkout__summary">
          <div class="checkout-summary">
            <h3>合计</h3>
            <div class="checkout-summary__row">
              <span>商品总价</span>
              <strong>¥{{ totalPrice }}</strong>
            </div>
            <div class="checkout-summary__row">
              <span>运费</span>
              <strong class="checkout-summary__free">¥0</strong>
            </div>
            <div class="checkout-summary__row">
              <span>商品数量</span>
              <strong>{{ items.length }} 件</strong>
            </div>
            <div class="checkout-summary__divider" />
            <div class="checkout-summary__row checkout-summary__row--total">
              <span>应付合计</span>
              <strong class="checkout-summary__total">¥{{ totalPrice }}</strong>
            </div>
            <button class="checkout-summary__submit" @click="onSubmit" :disabled="submitting">
              <span>{{ submitting ? '提交中...' : '提交订单' }}</span>
              <span class="checkout-summary__arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17 17 7M9 7h8v8"/></svg>
              </span>
            </button>
            <p class="checkout-summary__hint">
              * 拾光集仅提供撮合服务，最终交易由买家与卖家自行完成。建议同学之间面交，注意财物安全。
            </p>
          </div>
        </aside>
      </div>

      <EmptyState v-else title="未找到商品" desc="可能购物车已变化，请返回购物车重试" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { useUserStore } from '@/stores/user'
import EmptyState from '@/components/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()
const userStore = useUserStore()

const submitting = ref(false)

const methods = [
  { key: 'meet', icon: '◐', name: '校园面交', desc: '在校园指定地点见面交易' },
  { key: 'express', icon: '◇', name: '快递邮寄', desc: '由卖家安排寄送' },
  { key: 'self', icon: '◌', name: '自提', desc: '前往卖家所在校区自提' }
]

const form = reactive({
  method: 'meet',
  campus: userStore.currentUser?.campus || '',
  address: '',
  phone: userStore.currentUser?.phone || '',
  note: ''
})

const items = computed(() => {
  const ids = (route.query.ids || '').split(',').filter(Boolean)
  if (route.query.itemId) {
    // 直接购买场景
    const item = cartStore.items.find(i => i.id === route.query.itemId)
    if (item) return [item]
    // 走 sessionStorage
    try {
      const direct = JSON.parse(sessionStorage.getItem('glean_buy_now') || 'null')
      if (direct && direct.id === route.query.itemId) return [direct]
    } catch {}
    return []
  }
  return cartStore.items.filter(i => ids.includes(i.id))
})

const totalPrice = computed(() => items.value.reduce((s, i) => s + i.price, 0))

async function onSubmit() {
  if (!form.address.trim()) return ElMessage.warning('请填写交易地点 / 地址')
  if (!form.phone.trim()) return ElMessage.warning('请填写联系电话')

  submitting.value = true
  try {
    const order = orderStore.createOrder(
      {
        ...userStore.currentUser,
        campus: form.campus
      },
      items.value,
      form.address,
      form.note
    )

    // 从购物车移除已下单的商品（若来自购物车）
    if (!route.query.itemId) {
      items.value.forEach(i => cartStore.removeItem(i.id))
    } else {
      sessionStorage.removeItem('glean_buy_now')
    }

    ElMessage.success('订单已提交！')
    router.push(`/order/${order.id}`)
  } catch (e) {
    ElMessage.error('提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (!items.value.length) {
    ElMessage.warning('未找到要下单的商品')
  }
})
</script>

<style lang="scss" scoped>
.checkout {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 32px 80px;

  &__head {
    margin-bottom: 32px;
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
    font-size: clamp(28px, 4vw, 44px);
    line-height: 1.1;
    color: $ink-900;

    em { font-style: italic; color: $accent-caramel; }
  }

  &__main {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 24px;
    align-items: flex-start;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__methods {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  &__method {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: $radius-md;
    background: $cream-100;
    border: 1.5px solid $cream-300;
    text-align: left;
    cursor: pointer;
    transition: all .35s $ease-fluid;

    &-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: $cream-200;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: $font-display;
      font-size: 18px;
      color: $accent-caramel;
      flex-shrink: 0;
    }

    &-name {
      font-size: 13px;
      font-weight: 600;
      color: $ink-900;
      margin-bottom: 2px;
    }
    &-desc {
      font-size: 11px;
      color: $ink-400;
    }

    &--active {
      background: $cream-50;
      border-color: $ink-800;
      box-shadow: 0 0 0 3px rgba(31, 58, 46, 0.06);

      .checkout__method-icon {
        background: $ink-900;
        color: $accent-caramel;
      }
    }

    &:hover:not(&--active) {
      border-color: $cream-400;
      background: $cream-50;
    }
  }

  &__field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  &__field {
    margin-bottom: 14px;

    label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: $ink-400;
      margin-bottom: 8px;
    }

    input, textarea {
      width: 100%;
      padding: 12px 16px;
      border-radius: $radius-md;
      border: 1.5px solid $cream-300;
      background: $cream-100;
      font-size: 14px;
      color: $ink-900;
      outline: none;
      transition: all .3s $ease-soft;
      box-sizing: border-box;
      font-family: $font-sans;

      &:focus { border-color: $ink-800; background: $cream-50; }
      &::placeholder { color: $ink-300; }
      &[readonly] { background: $cream-200; cursor: not-allowed; color: $ink-400; }
    }

    textarea { resize: vertical; min-height: 70px; line-height: 1.6; }
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__summary {
    position: sticky;
    top: 110px;
  }
}

.checkout-card {
  border-radius: $radius-xl;
  background: $cream-50;
  border: 1px solid rgba(20, 32, 26, 0.06);
  box-shadow: $shadow-soft;
  overflow: hidden;

  &__head {
    padding: 18px 24px;
    border-bottom: 1px solid $cream-200;
    display: flex;
    align-items: center;
    gap: 8px;

    h3 {
      font-family: $font-display;
      font-size: 18px;
      color: $ink-900;
    }
  }

  &__count {
    margin-left: 8px;
    padding: 2px 10px;
    border-radius: $radius-pill;
    background: $cream-200;
    font-family: $font-mono;
    font-size: 12px;
    color: $ink-600;
  }

  &__body {
    padding: 20px 24px 24px;
  }
}

.checkout-item {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 12px;
  border-radius: $radius-md;
  background: $cream-100;

  img {
    width: 64px;
    height: 64px;
    border-radius: $radius-sm;
    object-fit: cover;
    background: $cream-300;
  }

  &__info {
    h4 {
      font-size: 13px;
      font-weight: 600;
      color: $ink-900;
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  &__meta {
    display: flex;
    gap: 6px;
    margin-bottom: 4px;
  }

  &__cond, &__cat {
    padding: 1px 8px;
    border-radius: $radius-pill;
    font-size: 10px;
  }

  &__cond {
    background: $cream-300;
    color: $ink-600;
    font-weight: 600;
  }

  &__cat {
    background: rgba(90, 122, 78, 0.12);
    color: $accent-moss;
  }

  &__seller {
    font-size: 11px;
    color: $ink-400;
  }

  &__price {
    font-family: $font-display;
    font-size: 18px;
    color: $accent-caramel;
  }
}

.checkout-summary {
  padding: 28px;
  border-radius: $radius-xl;
  background: $cream-50;
  border: 1px solid rgba(20, 32, 26, 0.06);
  box-shadow: $shadow-soft;

  h3 {
    font-family: $font-display;
    font-size: 20px;
    color: $ink-900;
    margin-bottom: 20px;
  }

  &__row {
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
      padding-top: 14px;
      strong { font-family: $font-display; font-size: 30px; }
    }
  }

  &__free {
    color: $accent-moss !important;
  }

  &__total {
    color: $accent-caramel !important;
  }

  &__divider {
    height: 1px;
    background: $cream-300;
    margin: 8px 0;
  }

  &__submit {
    width: 100%;
    margin-top: 16px;
    display: inline-flex;
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

    &:disabled { opacity: 0.5; cursor: not-allowed; }
    &:not(:disabled):hover {
      background: $accent-caramel;
      transform: translateY(-2px);
      .checkout-summary__arrow { background: $cream-50; color: $accent-caramel; transform: translate(2px, -2px); }
    }
  }

  &__arrow {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: $accent-caramel;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    svg { width: 16px; height: 16px; }
  }

  &__hint {
    margin-top: 14px;
    font-size: 11px;
    color: $ink-300;
    line-height: 1.7;
  }
}

@media (max-width: 1024px) {
  .checkout__main { grid-template-columns: 1fr; }
  .checkout__summary { position: static; }
}
@media (max-width: 768px) {
  .checkout { padding: 24px 16px 48px; }
  .checkout__methods { grid-template-columns: 1fr; }
  .checkout__field-row { grid-template-columns: 1fr; }
}
</style>
