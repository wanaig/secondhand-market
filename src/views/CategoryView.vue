<template>
  <div class="category">
    <div class="category__container">
      <span class="category__eyebrow">CATEGORY · {{ currentCat?.name || '浏览分类' }}</span>
      <h1 class="category__title">{{ currentCat?.name || '分类' }}<em>好物集</em></h1>
      <p class="category__desc">{{ currentCat?.sub?.join(' · ') }}</p>

      <div class="category__sub-filter">
        <button
          class="filter-chip"
          :class="{ 'filter-chip--active': !activeSub }"
          @click="activeSub = ''; loadData()"
        >全部</button>
        <button
          v-for="s in (currentCat?.sub || [])"
          :key="s"
          class="filter-chip"
          :class="{ 'filter-chip--active': activeSub === s }"
          @click="activeSub = s; loadData()"
        >{{ s }}</button>
      </div>

      <div class="category__grid">
        <ItemCard v-for="item in items" :key="item.id" :item="item" />
      </div>

      <EmptyState v-if="!items.length" title="该分类暂无好物" desc="换个分类看看？" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getItems } from '@/api/item'
import { categories } from '@/mock'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'

const route = useRoute()
const items = ref([])
const activeSub = ref('')

const currentCat = computed(() => categories.find(c => c.key === route.params.type))

async function loadData() {
  const params = { category: route.params.type, size: 20 }
  const res = await getItems(params)
  let list = res.data.list
  if (activeSub.value) {
    list = list.filter(i => i.sub === activeSub.value)
  }
  items.value = list
}

watch(() => route.params.type, () => {
  activeSub.value = ''
  loadData()
})

onMounted(loadData)
</script>

<style lang="scss" scoped>
.category {
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
    font-size: clamp(32px, 4vw, 48px);
    color: $ink-900;
    margin-bottom: 8px;

    em { font-style: italic; color: $accent-caramel; margin-left: 8px; }
  }

  &__desc {
    font-size: 13px;
    color: $ink-400;
    margin-bottom: 28px;
    letter-spacing: 0.05em;
  }

  &__sub-filter {
    display: flex;
    gap: 6px;
    margin-bottom: 36px;
    flex-wrap: wrap;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
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

@media (max-width: 1024px) {
  .category__grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
  .category { padding: 24px 16px 48px; }
  .category__grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
