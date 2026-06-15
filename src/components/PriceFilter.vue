<template>
  <div class="price-filter">
    <div class="price-filter__head">
      <span class="price-filter__label">价格区间</span>
      <button v-if="hasValue" class="price-filter__reset" @click="reset">重置</button>
    </div>
    <div class="price-filter__inputs">
      <div class="price-filter__field">
        <span>¥</span>
        <input v-model.number="minVal" type="number" min="0" placeholder="最低" @change="emitChange" />
      </div>
      <div class="price-filter__divider">—</div>
      <div class="price-filter__field">
        <span>¥</span>
        <input v-model.number="maxVal" type="number" min="0" placeholder="最高" @change="emitChange" />
      </div>
    </div>
    <div class="price-filter__quick">
      <button
        v-for="r in quickRanges"
        :key="r.label"
        class="price-filter__quick-btn"
        :class="{ 'price-filter__quick-btn--active': isActiveRange(r) }"
        @click="applyQuick(r)"
      >{{ r.label }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  min: { type: Number, default: 0 },
  max: { type: Number, default: 0 }
})
const emit = defineEmits(['change'])

const minVal = ref(props.min || null)
const maxVal = ref(props.max || null)

const quickRanges = [
  { label: '¥0–50',     min: 0,    max: 50 },
  { label: '¥50–200',   min: 50,   max: 200 },
  { label: '¥200–500',  min: 200,  max: 500 },
  { label: '¥500–1500', min: 500,  max: 1500 },
  { label: '¥1500+',    min: 1500, max: 99999 }
]

const hasValue = computed(() => minVal.value || maxVal.value)

function reset() {
  minVal.value = null
  maxVal.value = null
  emitChange()
}

function applyQuick(r) {
  minVal.value = r.min
  maxVal.value = r.max
  emitChange()
}

function isActiveRange(r) {
  return minVal.value === r.min && maxVal.value === r.max
}

function emitChange() {
  emit('change', {
    min: minVal.value || 0,
    max: maxVal.value || 999999
  })
}

watch(() => [props.min, props.max], ([a, b]) => {
  minVal.value = a || null
  maxVal.value = b || null
})
</script>

<style lang="scss" scoped>
.price-filter {
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  &__label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: $ink-600;
    text-transform: uppercase;
  }
  &__reset {
    font-size: 11px;
    color: $accent-caramel;
    cursor: pointer;

    &:hover { text-decoration: underline; }
  }

  &__inputs {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
  }

  &__field {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: $radius-md;
    background: $cream-100;
    border: 1.5px solid transparent;
    transition: all .3s $ease-soft;

    &:focus-within {
      border-color: $ink-800;
      background: $cream-50;
    }

    span {
      font-size: 13px;
      color: $ink-400;
      font-weight: 600;
    }
    input {
      flex: 1;
      width: 100%;
      border: none;
      outline: none;
      background: transparent;
      font-size: 13px;
      color: $ink-900;
      font-family: $font-sans;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button { display: none; }
    }
  }

  &__divider {
    color: $ink-300;
  }

  &__quick {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__quick-btn {
    padding: 5px 12px;
    border-radius: $radius-pill;
    background: $cream-100;
    border: 1px solid $cream-300;
    font-size: 11px;
    color: $ink-600;
    cursor: pointer;
    transition: all .3s $ease-soft;

    &:hover {
      border-color: $ink-800;
      color: $ink-900;
    }

    &--active {
      background: $ink-900;
      border-color: $ink-900;
      color: $cream-50;
    }
  }
}
</style>
