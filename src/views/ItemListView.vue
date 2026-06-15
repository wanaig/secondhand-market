<template>
  <div class="item-list">
    <div class="item-list__container">
      <!-- 顶部 -->
      <div class="item-list__head">
        <div>
          <span class="item-list__eyebrow">MARKETPLACE · 全部好物</span>
          <h1 class="item-list__title">探索校园里的<em>每一件好物</em></h1>
        </div>
        <SearchBar style="max-width: 420px;" @search="onSearch" />
      </div>

      <!-- 筛选栏 -->
      <div class="item-list__filters">
        <div class="item-list__filter-group">
          <button
            v-for="c in categoryOptions"
            :key="c.key"
            class="filter-chip"
            :class="{ 'filter-chip--active': filters.category === c.key }"
            @click="filters.category = c.key; loadData()"
          >{{ c.name }}</button>
        </div>
        <div class="item-list__filter-group">
          <select v-model="filters.sort" @change="loadData" class="filter-select">
            <option value="latest">最新上架</option>
            <option value="hot">最多浏览</option>
            <option value="priceAsc">价格低→高</option>
            <option value="priceDesc">价格高→低</option>
          </select>
        </div>
      </div>

      <!-- 价格筛选 -->
      <div class="item-list__price-row">
        <div class="price-filter">
          <input v-model.number="filters.minPrice" type="number" placeholder="最低价" class="price-input" @change="loadData" />
          <span class="price-divider">—</span>
          <input v-model.number="filters.maxPrice" type="number" placeholder="最高价" class="price-input" @change="loadData" />
        </div>
        <span class="item-list__count">共 {{ total }} 件好物</span>
      </div>

      <!-- 商品网格 -->
      <div class="item-list__grid">
        <ItemCard v-for="item in items" :key="item.id" :item="item" />
      </div>

      <EmptyState v-if="!items.length && !loading" title="没有找到好物" desc="试试换个条件搜索？" />

      <!-- 分页 -->
      <div class="item-list__pagination" v-if="total > pageSize">
        <button
          v-for="p in totalPages"
          :key="p"
          class="page-btn"
          :class="{ 'page-btn--active': p === page }"
          @click="page = p; loadData()"
        >{{ p }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getItems } from '@/api/item'
import { categories } from '@/mock'
import ItemCard from '@/components/ItemCard.vue'
import SearchBar from '@/components/SearchBar.vue'
import EmptyState from '@/components/EmptyState.vue'

const items = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(12)
const loading = ref(false)

const filters = ref({
  category: 'all',
  sort: 'latest',
  minPrice: '',
  maxPrice: '',
  keyword: ''
})

const categoryOptions = computed(() => [{ key: 'all', name: '全部' }, ...categories])

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

async function loadData() {
  loading.value = true
  try {
    const params = {
      page: page.value,
      size: pageSize.value,
      sort: filters.value.sort
    }
    if (filters.value.category !== 'all') params.category = filters.value.category
    if (filters.value.keyword) params.keyword = filters.value.keyword
    if (filters.value.minPrice) params.minPrice = filters.value.minPrice
    if (filters.value.maxPrice) params.maxPrice = filters.value.maxPrice

    const res = await getItems(params)
    items.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

function onSearch(kw) {
  filters.value.keyword = kw
  page.value = 1
  loadData()
}

onMounted(loadData)
</script>

<style lang="scss" scoped>
.item-list {
  max-width: 1440px;
  margin: 0 auto;
  padding: 48px 32px 80px;

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 20px;
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
    margin-bottom: 12px;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(32px, 4vw, 48px);
    line-height: 1.1;
    color: $ink-900;

    em {
      font-style: italic;
      color: $accent-caramel;
    }
  }

  &__filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  &__filter-group {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  &__price-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 36px;
    padding-bottom: 20px;
    border-bottom: 1px solid $cream-300;
  }

  &__count {
    margin-left: auto;
    font-size: 12px;
    color: $ink-400;
    font-family: $font-mono;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  &__pagination {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 48px;
  }
}

.filter-chip {
  padding: 7px 14px;
  border-radius: $radius-pill;
  background: $cream-200;
  font-size: 12px;
  font-weight: 500;
  color: $ink-600;
  cursor: pointer;
  transition: all .3s $ease-fluid;

  &--active {
    background: $ink-900;
    color: $cream-50;
  }
  &:hover:not(&--active) { background: $cream-300; }
}

.filter-select {
  padding: 7px 14px;
  border-radius: $radius-pill;
  background: $cream-200;
  font-size: 12px;
  font-weight: 500;
  color: $ink-600;
  outline: none;
  cursor: pointer;
  border: none;
  appearance: none;
}

.price-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-input {
  width: 100px;
  padding: 7px 12px;
  border-radius: $radius-pill;
  border: 1px solid $cream-300;
  background: $cream-50;
  font-size: 12px;
  color: $ink-900;
  outline: none;
  font-family: $font-mono;
  transition: border-color .3s;

  &:focus { border-color: $ink-800; }
}

.price-divider {
  color: $ink-300;
  font-size: 12px;
}

.page-btn {
  width: 40px;
  height: 40px;
  border-radius: $radius-md;
  background: $cream-200;
  font-size: 13px;
  font-weight: 600;
  color: $ink-600;
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

@media (max-width: 1024px) {
  .item-list__grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
  .item-list { padding: 24px 16px 48px; }
  .item-list__grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
