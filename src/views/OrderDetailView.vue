<template>
  <div class="order-detail">
    <div class="order-detail__container" v-if="order">
      <div class="order-detail__breadcrumb">
        <router-link to="/profile/orders">我的订单</router-link>
        <span>/</span>
        <span class="current">订单详情</span>
      </div>

      <!-- 状态卡 -->
      <div class="order-status" :class="`order-status--${order.status}`">
        <div class="order-status__icon">
          <span v-if="order.status === 'pending'">◐</span>
          <span v-else-if="order.status === 'confirmed'">◑</span>
          <span v-else-if="order.status === 'completed'">●</span>
          <span v-else>◌</span>
        </div>
        <div class="order-status__info">
          <h2>{{ order.statusText }}</h2>
          <p v-if="order.status === 'pending'">订单已提交，等待卖家确认。可以与卖家私信沟通面交细节。</p>
          <p v-else-if="order.status === 'confirmed'">卖家已确认订单，请按约定时间地点完成交易。</p>
          <p v-else-if="order.status === 'completed'">交易已完成，感谢使用拾光集！</p>
          <p v-else>订单已取消</p>
        </div>
        <div class="order-status__actions">
          <button v-if="order.status === 'pending'" class="order-status__btn order-status__btn--primary" @click="onConfirm">
            确认完成
          </button>
          <button v-if="order.status === 'pending'" class="order-status__btn" @click="onCancel">
            取消订单
          </button>
          <button v-if="order.status === 'confirmed'" class="order-status__btn order-status__btn--primary" @click="onComplete">
            确认收货
          </button>
        </div>
      </div>

      <!-- 主体 -->
      <div class="order-detail__body">
        <div class="order-detail__main">
          <!-- 订单时间线 -->
          <section class="order-card">
            <h3>订单进度</h3>
            <div class="timeline">
              <div v-for="(t, i) in [...order.timeline].reverse()" :key="i" class="timeline__item">
                <div class="timeline__dot" :class="{ 'timeline__dot--active': i === 0 }"></div>
                <div class="timeline__body">
                  <div class="timeline__text">{{ t.text }}</div>
                  <div class="timeline__time">{{ t.time }}</div>
                </div>
              </div>
            </div>
          </section>

          <!-- 商品清单 -->
          <section class="order-card">
            <h3>订单商品 <span class="order-card__count">{{ order.items.length }} 件</span></h3>
            <div class="order-items">
              <div v-for="i in order.items" :key="i.id" class="order-item" @click="$router.push(`/items/${i.id}`)">
                <img :src="i.cover" :alt="i.title" />
                <div class="order-item__info">
                  <h4>{{ i.title }}</h4>
                  <div class="order-item__meta">
                    <span class="order-item__cond">{{ i.condition }}</span>
                    <span class="order-item__cat">{{ i.categoryName }}</span>
                  </div>
                </div>
                <div class="order-item__price">¥{{ i.price }}</div>
              </div>
            </div>
          </section>

          <!-- 交易信息 -->
          <section class="order-card">
            <h3>交易信息</h3>
            <div class="info-grid">
              <div class="info-grid__item">
                <span class="info-grid__label">订单编号</span>
                <span class="info-grid__value">{{ order.id }}</span>
              </div>
              <div class="info-grid__item">
                <span class="info-grid__label">下单时间</span>
                <span class="info-grid__value">{{ order.createdText }}</span>
              </div>
              <div class="info-grid__item">
                <span class="info-grid__label">交易方式</span>
                <span class="info-grid__value">{{ order.tradeMethod || '校园面交' }}</span>
              </div>
              <div class="info-grid__item">
                <span class="info-grid__label">交易地点</span>
                <span class="info-grid__value">{{ order.address }}</span>
              </div>
              <div v-if="order.note" class="info-grid__item info-grid__item--full">
                <span class="info-grid__label">备注</span>
                <span class="info-grid__value">{{ order.note }}</span>
              </div>
            </div>
          </section>
        </div>

        <!-- 右侧 -->
        <aside class="order-detail__side">
          <!-- 卖家信息 -->
          <section class="order-card order-card--side">
            <h3>卖家信息</h3>
            <div class="seller-block">
              <img :src="order.sellerAvatar" alt="" />
              <div>
                <div class="seller-block__name">{{ order.sellerName }}</div>
                <div class="seller-block__campus">{{ order.items[0]?.categoryName || '校园好物' }}</div>
              </div>
            </div>
            <button class="order-detail__chat-btn" @click="onChat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12c0 4-4 7-9 7-1.2 0-2.4-.2-3.5-.5L4 20l1.5-4C4 14.8 3 13.5 3 12c0-4 4-7 9-7s9 3 9 7Z"/></svg>
              <span>联系卖家</span>
            </button>
          </section>

          <!-- 价格明细 -->
          <section class="order-card order-card--side">
            <h3>金额明细</h3>
            <div class="price-block">
              <div class="price-block__row">
                <span>商品总价</span>
                <strong>¥{{ order.totalPrice }}</strong>
              </div>
              <div class="price-block__row">
                <span>运费</span>
                <strong class="text-moss">¥0</strong>
              </div>
              <div class="price-block__divider" />
              <div class="price-block__row price-block__row--total">
                <span>实付合计</span>
                <strong>¥{{ order.totalPrice }}</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>

    <EmptyState v-else title="订单不存在" desc="可能已被删除或链接错误" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useOrderStore } from '@/stores/order'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import EmptyState from '@/components/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()
const chatStore = useChatStore()
const userStore = useUserStore()

const order = computed(() => orderStore.orders.find(o => o.id === route.params.id))

async function onCancel() {
  try {
    await ElMessageBox.confirm('确定要取消订单吗？', '提示', {
      confirmButtonText: '取消订单',
      cancelButtonText: '再想想',
      type: 'warning'
    })
    orderStore.cancelOrder(order.value.id)
    ElMessage.success('订单已取消')
  } catch {}
}

function onConfirm() {
  orderStore.confirmOrder(order.value.id)
  ElMessage.success('已确认')
}

function onComplete() {
  orderStore.completeOrder(order.value.id)
  ElMessage.success('交易完成，感谢使用拾光集！')
}

function onChat() {
  if (!order.value) return
  const conv = chatStore.createOrGetConversation(
    userStore.currentUser,
    {
      id: order.value.sellerId,
      nickname: order.value.sellerName,
      avatar: order.value.sellerAvatar
    },
    {
      id: order.value.items[0].id,
      title: order.value.items[0].title,
      cover: order.value.items[0].cover,
      price: order.value.items[0].price
    }
  )
  router.push(`/chat/${conv.id}`)
}
</script>

<style lang="scss" scoped>
.order-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 32px 80px;

  &__breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: $ink-400;
    margin-bottom: 20px;

    a { color: $ink-400; transition: color .3s; &:hover { color: $accent-caramel; } }
    .current { color: $ink-800; font-weight: 500; }
  }

  &__body {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 24px;
    align-items: flex-start;
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__side {
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: sticky;
    top: 110px;
  }

  &__chat-btn {
    width: 100%;
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    border-radius: $radius-pill;
    background: $ink-900;
    color: $cream-50;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all .35s $ease-fluid;

    svg { width: 16px; height: 16px; }

    &:hover {
      background: $accent-caramel;
      transform: translateY(-1px);
    }
  }
}

// —— 状态卡 ——
.order-status {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 28px 32px;
  border-radius: $radius-xl;
  background: $ink-900;
  color: $cream-50;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -100px;
    right: -100px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(200, 99, 43, 0.25), transparent 70%);
  }

  &--completed::before {
    background: radial-gradient(circle, rgba(90, 122, 78, 0.3), transparent 70%);
  }

  &--cancelled {
    background: $ink-600;
    &::before { background: radial-gradient(circle, rgba(178, 58, 42, 0.2), transparent 70%); }
  }

  &__icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(253, 251, 246, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: $font-display;
    font-size: 32px;
    color: $accent-caramel;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }

  &__info {
    flex: 1;
    position: relative;
    z-index: 1;

    h2 {
      font-family: $font-display;
      font-size: 24px;
      color: $cream-50;
      margin-bottom: 4px;
    }
    p {
      font-size: 13px;
      color: $cream-400;
      line-height: 1.6;
    }
  }

  &__actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }

  &__btn {
    padding: 10px 22px;
    border-radius: $radius-pill;
    border: 1.5px solid rgba(253, 251, 246, 0.3);
    color: $cream-100;
    background: transparent;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all .35s $ease-fluid;

    &:hover { background: rgba(253, 251, 246, 0.1); }

    &--primary {
      background: $accent-caramel;
      border-color: $accent-caramel;

      &:hover { background: $accent-rust; border-color: $accent-rust; }
    }
  }
}

// —— 卡片基类 ——
.order-card {
  padding: 24px;
  border-radius: $radius-xl;
  background: $cream-50;
  border: 1px solid rgba(20, 32, 26, 0.06);
  box-shadow: $shadow-soft;

  h3 {
    font-family: $font-display;
    font-size: 18px;
    color: $ink-900;
    margin-bottom: 18px;
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
}

// —— 时间线 ——
.timeline {
  position: relative;
  padding-left: 16px;

  &__item {
    position: relative;
    padding-left: 20px;
    padding-bottom: 16px;
    border-left: 2px solid $cream-300;

    &:last-child { border-left-color: transparent; padding-bottom: 0; }
  }

  &__dot {
    position: absolute;
    left: -7px;
    top: 4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: $cream-300;
    border: 2px solid $cream-50;
    box-shadow: 0 0 0 2px $cream-300;

    &--active {
      background: $accent-caramel;
      box-shadow: 0 0 0 2px $accent-caramel, 0 0 0 6px rgba(200, 99, 43, 0.2);
    }
  }

  &__text {
    font-size: 14px;
    color: $ink-900;
    font-weight: 500;
    margin-bottom: 4px;
  }

  &__time {
    font-size: 11px;
    color: $ink-400;
    font-family: $font-mono;
  }
}

// —— 订单商品 ——
.order-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-item {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 12px;
  border-radius: $radius-md;
  background: $cream-100;
  cursor: pointer;
  transition: background .3s;

  &:hover { background: $cream-200; }

  img {
    width: 64px;
    height: 64px;
    border-radius: $radius-sm;
    object-fit: cover;
    background: $cream-300;
  }

  &__info h4 {
    font-size: 14px;
    font-weight: 600;
    color: $ink-900;
    margin-bottom: 6px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__meta {
    display: flex;
    gap: 6px;
  }

  &__cond, &__cat {
    padding: 2px 8px;
    border-radius: $radius-pill;
    font-size: 10px;
  }

  &__cond { background: $cream-300; color: $ink-600; font-weight: 600; }
  &__cat { background: rgba(90, 122, 78, 0.12); color: $accent-moss; }

  &__price {
    font-family: $font-display;
    font-size: 20px;
    color: $accent-caramel;
  }
}

// —— 信息栅格 ——
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  &__item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px 14px;
    border-radius: $radius-md;
    background: $cream-100;

    &--full { grid-column: 1 / -1; }
  }

  &__label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: $ink-400;
  }

  &__value {
    font-size: 13px;
    color: $ink-800;
    font-weight: 500;
    word-break: break-all;
  }
}

// —— 卖家块 ——
.seller-block {
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: $cream-300;
  }

  &__name {
    font-size: 14px;
    font-weight: 600;
    color: $ink-900;
    margin-bottom: 2px;
  }

  &__campus {
    font-size: 11px;
    color: $ink-400;
  }
}

// —— 价格块 ——
.price-block {
  &__row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 13px;
    color: $ink-600;

    strong { font-weight: 600; color: $ink-900; }

    &--total {
      padding-top: 12px;
      strong { font-family: $font-display; font-size: 26px; color: $accent-caramel; }
    }
  }

  &__divider {
    height: 1px;
    background: $cream-300;
    margin: 8px 0;
  }
}

@media (max-width: 1024px) {
  .order-detail__body { grid-template-columns: 1fr; }
  .order-detail__side { position: static; }
}
@media (max-width: 768px) {
  .order-detail { padding: 16px; }
  .order-status { flex-direction: column; align-items: flex-start; padding: 24px; }
  .order-status__actions { width: 100%; }
  .info-grid { grid-template-columns: 1fr; }
}
</style>
