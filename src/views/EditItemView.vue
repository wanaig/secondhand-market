<template>
  <div class="edit-item">
    <div class="edit-item__container">
      <span class="edit-item__eyebrow">EDIT · 编辑商品</span>
      <h1 class="edit-item__title">编辑<em>商品信息</em></h1>

      <div class="edit-item__form-card">
        <div class="edit-item__form-inner">
          <div class="edit-item__field">
            <label>商品标题 <span>*</span></label>
            <input v-model="form.title" type="text" maxlength="40" />
          </div>

          <div class="edit-item__row">
            <div class="edit-item__field">
              <label>分类</label>
              <select v-model="form.category">
                <option v-for="c in categoryList" :key="c.key" :value="c.key">{{ c.name }}</option>
              </select>
            </div>
            <div class="edit-item__field">
              <label>成色</label>
              <select v-model="form.condition">
                <option v-for="c in conditions" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
          </div>

          <div class="edit-item__row edit-item__row--3">
            <div class="edit-item__field">
              <label>售价</label>
              <div class="edit-item__price-wrap">
                <span>¥</span>
                <input v-model.number="form.price" type="number" />
              </div>
            </div>
            <div class="edit-item__field">
              <label>原价</label>
              <div class="edit-item__price-wrap">
                <span>¥</span>
                <input v-model.number="form.originalPrice" type="number" />
              </div>
            </div>
            <div class="edit-item__field">
              <label>状态</label>
              <select v-model="form.status">
                <option value="on">在售</option>
                <option value="off">已下架</option>
              </select>
            </div>
          </div>

          <div class="edit-item__field">
            <label>描述</label>
            <textarea v-model="form.description" rows="4"></textarea>
          </div>

          <div v-if="error" class="edit-item__error">{{ error }}</div>

          <div class="edit-item__submit-row">
            <button class="edit-item__submit" @click="onSave" :disabled="saving">
              {{ saving ? '保存中...' : '保存修改' }}
            </button>
            <button class="edit-item__cancel" @click="$router.back()">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getItem, updateItem } from '@/api/item'
import { categories } from '@/mock'

const route = useRoute()
const router = useRouter()
const categoryList = categories
const conditions = ['全新', '99新', '95新', '9成新', '8成新']

const form = reactive({
  title: '',
  category: '',
  condition: '',
  price: '',
  originalPrice: '',
  description: '',
  status: 'on'
})
const error = ref('')
const saving = ref(false)

async function loadItem() {
  const res = await getItem(route.params.id)
  const d = res.data
  form.title = d.title
  form.category = d.category
  form.condition = d.condition
  form.price = d.price
  form.originalPrice = d.originalPrice
  form.description = d.description
  form.status = d.status
}

async function onSave() {
  if (!form.title.trim()) { error.value = '标题不能为空'; return }
  error.value = ''
  saving.value = true
  try {
    const cat = categories.find(c => c.key === form.category)
    await updateItem(route.params.id, {
      ...form,
      categoryName: cat?.name || ''
    })
    router.push(`/items/${route.params.id}`)
  } catch {
    error.value = '保存失败'
  } finally {
    saving.value = false
  }
}

onMounted(loadItem)
</script>

<style lang="scss" scoped>
.edit-item {
  max-width: 880px;
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
    margin-bottom: 36px;

    em { font-style: italic; color: $accent-caramel; }
  }

  &__form-card {
    border-radius: $radius-xl;
    background: $cream-50;
    border: 1px solid rgba(20, 32, 26, 0.06);
    box-shadow: $shadow-soft;
  }

  &__form-inner {
    padding: 40px;
  }

  &__field {
    margin-bottom: 22px;

    label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: $ink-400;
      margin-bottom: 8px;

      span { color: $accent-caramel; }
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
    }
    input[type="number"] {
      -moz-appearance: textfield;
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
    select {
      width: 100%;
      padding: 12px 36px 12px 16px;
      border-radius: $radius-md;
      border: 1.5px solid $cream-300;
      background-color: $cream-100;
      font-size: 14px;
      color: $ink-900;
      outline: none;
      box-sizing: border-box;
      font-family: $font-sans;
      cursor: pointer;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7F73' stroke-width='1.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px;
      transition: all .3s $ease-soft;

      &:focus { border-color: $ink-800; background-color: $cream-50; }
    }
    textarea { resize: vertical; min-height: 100px; }
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    &--3 { grid-template-columns: 1fr 1fr 1fr; }
  }

  &__price-wrap {
    display: flex;
    align-items: center;
    border-radius: $radius-md;
    border: 1.5px solid $cream-300;
    background: $cream-100;
    overflow: hidden;

    span {
      padding: 12px 0 12px 16px;
      font-weight: 600;
      color: $accent-caramel;
    }
    input {
      border: none;
      background: transparent;
      &:focus { box-shadow: none; border: none; }
    }
  }

  &__error {
    padding: 12px 16px;
    border-radius: $radius-md;
    background: rgba(178, 58, 42, 0.08);
    color: $danger;
    font-size: 13px;
    margin-bottom: 16px;
  }

  &__submit-row {
    display: flex;
    gap: 12px;
    margin-top: 28px;
  }

  &__submit {
    padding: 14px 36px;
    border-radius: $radius-pill;
    background: $ink-900;
    color: $cream-50;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all .4s $ease-fluid;

    &:hover { background: $accent-caramel; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }

  &__cancel {
    padding: 14px 28px;
    border-radius: $radius-pill;
    border: 1.5px solid $ink-800;
    color: $ink-800;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all .3s $ease-fluid;

    &:hover { background: $ink-900; color: $cream-50; }
  }
}
</style>
