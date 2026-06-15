<template>
  <div class="search-bar" :class="{ 'search-bar--focused': focused }">
    <svg class="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
    </svg>
    <input
      v-model="keyword"
      type="text"
      :placeholder="placeholder"
      class="search-bar__input"
      @focus="focused = true"
      @blur="onBlur"
      @keyup.enter="onSearch"
    />
    <button v-if="keyword" class="search-bar__clear" @click="keyword = ''">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <button class="search-bar__btn" @click="onSearch">搜索</button>

    <!-- 历史记录 -->
    <transition name="slide-fade">
      <div v-if="focused && history.length" class="search-bar__history">
        <div class="search-bar__history-head">
          <span>搜索历史</span>
          <button @click="clearHistory">清空</button>
        </div>
        <div class="search-bar__history-list">
          <span v-for="(h, idx) in history" :key="idx" class="search-bar__history-tag" @mousedown.prevent="useHistory(h)">{{ h }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  placeholder: { type: String, default: '搜索好物：教材、数码、运动...' },
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['search', 'update:modelValue'])

const router = useRouter()
const keyword = ref(props.modelValue)
const focused = ref(false)
const history = ref([])

function onSearch() {
  const kw = keyword.value.trim()
  if (!kw) return
  addHistory(kw)
  emit('search', kw)
  emit('update:modelValue', kw)
  router.push({ path: '/search', query: { keyword: kw } })
}

function onBlur() {
  setTimeout(() => { focused.value = false }, 200)
}

function addHistory(kw) {
  history.value = [kw, ...history.value.filter(h => h !== kw)].slice(0, 8)
  localStorage.setItem('glean_search_history', JSON.stringify(history.value))
}

function clearHistory() {
  history.value = []
  localStorage.removeItem('glean_search_history')
}

function useHistory(h) {
  keyword.value = h
  onSearch()
}

onMounted(() => {
  try {
    history.value = JSON.parse(localStorage.getItem('glean_search_history')) || []
  } catch {}
})
</script>

<style lang="scss" scoped>
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 6px 6px 16px;
  background: $cream-100;
  border-radius: $radius-pill;
  border: 1.5px solid transparent;
  transition: all .4s $ease-fluid;

  &--focused {
    background: $cream-50;
    border-color: $ink-800;
    box-shadow: $shadow-soft;
  }

  &__icon {
    width: 18px;
    height: 18px;
    color: $ink-400;
    flex-shrink: 0;
    transition: color .3s;
  }
  &--focused &__icon { color: $ink-800; }

  &__input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: $ink-900;
    font-family: $font-sans;

    &::placeholder {
      color: $ink-300;
    }
  }

  &__clear {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: $ink-400;

    svg { width: 14px; height: 14px; }
    &:hover { background: $cream-300; }
  }

  &__btn {
    padding: 8px 20px;
    border-radius: $radius-pill;
    background: $ink-900;
    color: $cream-50;
    font-size: 13px;
    font-weight: 600;
    transition: all .35s $ease-fluid;

    &:hover { background: $accent-caramel; }
    &:active { transform: scale(0.96); }
  }

  &__history {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    padding: 14px;
    background: $cream-50;
    border-radius: $radius-md;
    box-shadow: $shadow-strong;
    border: 1px solid rgba(20, 32, 26, 0.06);
    z-index: 50;

    &-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: $ink-400;
      margin-bottom: 10px;

      button {
        font-size: 11px;
        color: $accent-caramel;
        cursor: pointer;
      }
    }

    &-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    &-tag {
      padding: 5px 12px;
      border-radius: $radius-pill;
      background: $cream-200;
      font-size: 12px;
      color: $ink-600;
      cursor: pointer;
      transition: all .3s $ease-soft;

      &:hover {
        background: $ink-900;
        color: $cream-50;
      }
    }
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all .3s $ease-fluid;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
