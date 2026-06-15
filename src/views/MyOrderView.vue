<template>
  <div class="my-order">
    <div class="my-order__head">
      <h2>我的订单</h2>
      <div class="my-order__tabs">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="my-order__tab"
          :class="{ 'my-order__tab--active': activeTab === t.key }"
          @click="activeTab = t.key"
        >
          {{ t.name }}
          <span v-if="getCountByStatus(t.key)" class="my-order__tab-badge">{{ getCountByStatus(t.key) }}</span>
        </button>
      </div>
    </div>

    <div v-if="filteredOrders.length" class="my-order__list">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="order-row"
        @click="$router.push(`/order/${order.id}`)"
      >
        <div class="order-row__head">
          <span class="order-row__id">订单号：{{ order.id }}</span>
          <span class="order-row__time">{{ order.createdText }}</span>
          <span class="order-row__status" :class="`order-row__status--${order.status}`">
            {{ order.statusText }}
          </span>
        </div>
        <div class="order-row__body">
          <div class="order-row__items">
            <div v-for="i in order.items.slice(0, 3)" :key="i.id" class="order-row__item">
              <img :src="i.cover" :alt="i.title" />
              <div>
                <h4>{{ i.title }}</h4>
                <span class="order-row__cond">{{ i.condition }} · {{ i.categoryName }}</span>
              </div>
            </div>
            <div v-if="order.items.length > 3" class="order-row__more">
              +{{ order.items.length - 3 }} 件
            </div>
          </div>
          <div class="order-row__summary">
            <div class="order-row__total">
              <span>合计</span>
              <strong>¥{{ order.totalPrice }}</strong>
            </div>
            <div class="order-row__seller">
              卖家：{{ order.sellerName }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <EmptyState
      v-else
      title="暂无订单"
      :desc="emptyDesc"
    >
      <template #action>
        <button class="my-order__cta" @click="$router.push('/items')">去逛好物</button>
      </template>
    </EmptyState>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOrderStore } from '@/stores/order'
import { useUserStore } from '@/stores/user'
import EmptyState from '@/components/EmptyState.vue'

const orderStore = useOrderStore()
const userStore = useUserStore()

const activeTab = ref('all')

const tabs = [
  { key: 'all',       name: '全部' },
  { key: 'pending',   name: '待确认' },
  { key: 'confirmed', name: '进行中' },
  { key: 'completed', name: '已完成' },
  { key: 'cancelled', name: '已取消' }
]

const myOrders = computed(() => orderStore.getMyOrders(userStore.userId))

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return myOrders.value
  return myOrders.value.filter(o => o.status === activeTab.value)
})

function getCountByStatus(key) {
  if (key === 'all') return myOrders.value.length
  return myOrders.value.filter(o => o.status === key).length
}

const emptyDesc = computed(() => {
  if (activeTab.value === 'all') return '还没有创建任何订单'
  return `没有「${tabs.find(t => t.key === activeTab.value)?.name}」状态的订单`
})
</script>

<style lang="scss" scoped>
.my-order {
  &__head {
    margin-bottom: 24px;

    h2 {
      font-family: $font-display;
      font-size: 24px;
      color: $ink-900;
      margin-bottom: 16px;
    }
  }

  &__tabs {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    padding: 4px;
    background: $cream-200;
    border-radius: $radius-pill;
    width: max-content;
  }

  &__tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    border-radius: $radius-pill;
    font-size: 12px;
    font-weight: 600;
    color: $ink-600;
    cursor: pointer;
    transition: all .35s $ease-fluid;

    &--active {
      background: $cream-50;
      color: $ink-900;
      box-shadow: $shadow-soft;
    }

    &-badge {
      padding: 1px 6px;
      border-radius: $radius-pill;
      background: $accent-caramel;
      color: $cream-50;
      font-family: $font-mono;
      font-size: 10px;
      font-weight: 700;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__cta {
    padding: 12px 28px;
    border-radius: $radius-pill;
    background: $ink-900;
    color: $cream-50;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all .3s;
    &:hover { background: $accent-caramel; }
  }
}

.order-row {
  padding: 18px;
  border-radius: $radius-lg;
  background: $cream-100;
  cursor: pointer;
  transition: all .35s $ease-fluid;
  border: 1px solid transparent;

  &:hover {
    background: $cream-50;
    border-color: rgba(20, 32, 26, 0.08);
    transform: translateX(4px);
  }

  &__head {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 14px;
    margin-bottom: 14px;
    border-bottom: 1px dashed $cream-300;
  }

  &__id {
    font-family: $font-mono;
    font-size: 11px;
    color: $ink-400;
    color: $ink-400;
  }

  &__time {
    font-size: 11px;
    color: $ink-300;
  }

  &__status {
    margin-left: auto;
    padding: 3px 12px;
    border-radius: $radius-pill;
    font-size: 11px;
    font-weight: 700;

    &--pending {
      background: rgba(200, 99, 43, 0.12);
      color: $accent-caramel;
    }
    &--confirmed {
      background: rgba(90, 122, 78, 0.12);
      color: $accent-moss;
    }
    &--completed {
      background: $cream-300;
      color: $ink-600;
    }
    &--cancelled {
      background: rgba(178, 58, 42, 0.1);
      color: $danger;
    }
  }

  &__body {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  &__items {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    overflow: hidden;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;

    img {
      width: 56px;
      height: 56px;
      border-radius: $radius-sm;
      object-fit: cover;
      background: $cream-300;
      flex-shrink: 0;
    }

    h4 {
      font-size: 13px;
      font-weight: 600;
      color: $ink-900;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__cond {
    font-size: 11px;
    color: $ink-400;
  }

  &__more {
    padding: 4px 10px;
    border-radius: $radius-pill;
    background: $cream-300;
    font-size: 11px;
    color: $ink-600;
    font-family: $font-mono;
  }

  &__summary {
    text-align: right;
    flex-shrink: 0;
  }

  &__total {
    span {
      font-size: 11px;
      color: $ink-400;
      margin-right: 4px;
    }
    strong {
      font-family: $font-display;
      font-size: 22px;
      color: $accent-caramel;
    }
  }

  &__seller {
    font-size: 11px;
    color: $ink-400;
    margin-top: 4px;
  }
}

@media (max-width: 768px) {
  .order-row__body { flex-direction: column; align-items: stretch; }
  .order-row__summary { text-align: left; }
}
</style>
