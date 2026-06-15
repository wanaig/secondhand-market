<template>
  <div class="search-result">
    <div class="search-result__container">
      <div class="search-result__head">
        <span class="search-result__eyebrow">SEARCH · 搜索结果</span>
        <h1 class="search-result__title">
          搜索 "<em>{{ keyword }}</em>" 的结果
        </h1>
        <p class="search-result__count">共找到 {{ total }} 件好物</p>
      </div>

      <SearchBar :modelValue="keyword" @search="onSearch" style="max-width: 480px; margin-bottom: 36px;" />

      <div v-if="items.length" class="search-result__grid">
        <ItemCard v-for="item in items" :key="item.id" :item="item" />
      </div>

      <EmptyState v-else-if="!loading" title="没有找到相关好物" desc="换个关键词试试？" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getItems } from '@/api/item'
import ItemCard from '@/components/ItemCard.vue'
import SearchBar from '@/components/SearchBar.vue'
import EmptyState from '@/components/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const keyword = ref('')
const items = ref([])
const total = ref(0)
const loading = ref(false)

async function search() {
  loading.value = true
  try {
    const res = await getItems({ keyword: keyword.value, size: 24 })
    items.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

function onSearch(kw) {
  keyword.value = kw
  router.replace({ path: '/search', query: { keyword: kw } })
}

watch(() => route.query.keyword, (val) => {
  keyword.value = val || ''
  search()
}, { immediate: true })
</script>

<style lang="scss" scoped>
.search-result {
  max-width: 1440px;
  margin: 0 auto;
  padding: 48px 32px 80px;

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
    font-size: clamp(28px, 4vw, 48px);
    color: $ink-900;
    margin-bottom: 8px;

    em { font-style: italic; color: $accent-caramel; }
  }

  &__count {
    font-size: 13px;
    color: $ink-400;
    margin-bottom: 24px;
    font-family: $font-mono;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
}

@media (max-width: 1024px) {
  .search-result__grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
  .search-result { padding: 24px 16px 48px; }
  .search-result__grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
