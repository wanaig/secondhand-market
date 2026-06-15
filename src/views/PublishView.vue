<template>
  <div class="publish">
    <div class="publish__container">
      <span class="publish__eyebrow">PUBLISH · 发布好物</span>
      <h1 class="publish__title">分享你的<em>闲置好物</em></h1>
      <p class="publish__desc">填写以下信息，让同学发现你的宝贝</p>

      <div class="publish__form-card">
        <div class="publish__form-inner">
          <div class="publish__field">
            <label>商品标题 <span>*</span></label>
            <input v-model="form.title" type="text" placeholder="简洁描述商品，如：9成新 iPad Air 5 紫色" maxlength="40" />
            <span class="publish__count">{{ form.title.length }}/40</span>
          </div>

          <div class="publish__row">
            <div class="publish__field">
              <label>分类 <span>*</span></label>
              <select v-model="form.category">
                <option value="">请选择分类</option>
                <option v-for="c in categoryList" :key="c.key" :value="c.key">{{ c.name }}</option>
              </select>
            </div>
            <div class="publish__field">
              <label>子分类</label>
              <select v-model="form.sub">
                <option value="">请选择</option>
                <option v-for="s in currentSubs" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
          </div>

          <div class="publish__row publish__row--3">
            <div class="publish__field">
              <label>售价 <span>*</span></label>
              <div class="publish__price-wrap">
                <span class="publish__price-prefix">¥</span>
                <input v-model.number="form.price" type="number" placeholder="0" min="0" />
              </div>
            </div>
            <div class="publish__field">
              <label>原价</label>
              <div class="publish__price-wrap">
                <span class="publish__price-prefix">¥</span>
                <input v-model.number="form.originalPrice" type="number" placeholder="0" min="0" />
              </div>
            </div>
            <div class="publish__field">
              <label>成色 <span>*</span></label>
              <select v-model="form.condition">
                <option value="">选择成色</option>
                <option v-for="c in conditions" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
          </div>

          <div class="publish__field">
            <label>商品描述 <span>*</span></label>
            <textarea v-model="form.description" placeholder="详细描述商品的使用情况、瑕疵、转手原因等，让买家更放心..." rows="5" maxlength="500"></textarea>
            <span class="publish__count">{{ form.description.length }}/500</span>
          </div>

          <div class="publish__field">
            <label>商品图片</label>
            <div class="publish__images">
              <div v-for="(img, idx) in form.images" :key="idx" class="publish__img-item">
                <img :src="img" alt="" />
                <button class="publish__img-remove" @click="removeImage(idx)">×</button>
              </div>
              <label v-if="form.images.length < 9" class="publish__img-add">
                <input type="file" accept="image/*" @change="onImageSelect" hidden />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28"><path d="M12 5v14M5 12h14"/></svg>
                <span>添加图片</span>
              </label>
            </div>
            <p class="publish__hint">最多上传 9 张图片，建议上传实物照片</p>
          </div>

          <div class="publish__field">
            <label>交易方式</label>
            <div class="publish__tag-group">
              <button
                v-for="t in tradeOptions"
                :key="t"
                class="publish__tag-btn"
                :class="{ 'publish__tag-btn--active': form.tags.includes(t) }"
                @click="toggleTag(t)"
              >{{ t }}</button>
            </div>
          </div>

          <div v-if="error" class="publish__error">{{ error }}</div>

          <div class="publish__submit-row">
            <button class="publish__submit" @click="onSubmit" :disabled="submitting">
              {{ submitting ? '发布中...' : '立即发布' }}
            </button>
            <button class="publish__draft" @click="$router.back()">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { createItem } from '@/api/item'
import { useUserStore } from '@/stores/user'
import { categories } from '@/mock'

const router = useRouter()
const userStore = useUserStore()

const categoryList = computed(() => categories)
const currentSubs = computed(() => {
  const cat = categories.find(c => c.key === form.category)
  return cat ? cat.sub : []
})
const conditions = ['全新', '99新', '95新', '9成新', '8成新']
const tradeOptions = ['可面交', '支持邮寄', '仅自取', '价可商', '小刀勿扰']

const form = reactive({
  title: '',
  category: '',
  sub: '',
  price: '',
  originalPrice: '',
  condition: '',
  description: '',
  images: [],
  tags: ['可面交']
})

const error = ref('')
const submitting = ref(false)

function toggleTag(t) {
  const idx = form.tags.indexOf(t)
  if (idx > -1) form.tags.splice(idx, 1)
  else form.tags.push(t)
}

function onImageSelect(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    form.images.push(ev.target.result)
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}

function removeImage(idx) {
  form.images.splice(idx, 1)
}

async function onSubmit() {
  if (!form.title.trim()) { error.value = '请输入商品标题'; return }
  if (!form.category) { error.value = '请选择分类'; return }
  if (!form.price || form.price <= 0) { error.value = '请输入有效价格'; return }
  if (!form.condition) { error.value = '请选择成色'; return }
  if (!form.description.trim()) { error.value = '请填写商品描述'; return }

  error.value = ''
  submitting.value = true
  try {
    const cat = categories.find(c => c.key === form.category)
    const data = {
      title: form.title,
      category: form.category,
      categoryName: cat?.name || '',
      sub: form.sub,
      price: form.price,
      originalPrice: form.originalPrice || form.price * 1.5,
      condition: form.condition,
      description: form.description,
      images: form.images.length ? form.images : ['https://picsum.photos/seed/default/800/800'],
      cover: form.images.length ? form.images[0] : 'https://picsum.photos/seed/default/800/800',
      tags: form.tags,
      sellerId: userStore.userId,
      sellerName: userStore.currentUser.nickname,
      sellerAvatar: userStore.avatar,
      sellerCampus: userStore.currentUser.campus || '中心校区',
      sellerContact: userStore.currentUser.phone || `WeChat: glean_${userStore.username}`
    }
    const res = await createItem(data)
    if (res.code === 0) {
      router.push(`/items/${res.data.id}`)
    }
  } catch (e) {
    error.value = '发布失败，请重试'
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.publish {
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
    margin-bottom: 8px;

    em { font-style: italic; color: $accent-caramel; }
  }

  &__desc {
    font-size: 14px;
    color: $ink-400;
    margin-bottom: 36px;
  }

  &__form-card {
    border-radius: $radius-xl;
    background: $cream-50;
    border: 1px solid rgba(20, 32, 26, 0.06);
    box-shadow: $shadow-soft;
    overflow: hidden;
  }

  &__form-inner {
    padding: 40px;
  }

  &__field {
    margin-bottom: 24px;
    position: relative;

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

    input[type="text"],
    input[type="number"],
    select,
    textarea {
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

      &::placeholder { color: $ink-300; }
      &:focus {
        border-color: $ink-800;
        background: $cream-50;
        box-shadow: 0 0 0 3px rgba(31, 58, 46, 0.08);
      }
    }

    textarea { resize: vertical; min-height: 120px; line-height: 1.7; }
    select { cursor: pointer; appearance: none; }
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    &--3 {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  &__price-wrap {
    display: flex;
    align-items: center;
    border-radius: $radius-md;
    border: 1.5px solid $cream-300;
    background: $cream-100;
    overflow: hidden;
    transition: all .3s $ease-soft;

    &:focus-within {
      border-color: $ink-800;
      background: $cream-50;
    }
  }

  &__price-prefix {
    padding: 12px 0 12px 16px;
    font-size: 14px;
    font-weight: 600;
    color: $accent-caramel;
    background: transparent;
  }

  &__price-wrap input {
    border: none;
    background: transparent;
    padding: 12px 16px 12px 4px;

    &:focus {
      box-shadow: none;
      border-color: transparent;
      background: transparent;
    }
  }

  &__count {
    position: absolute;
    right: 14px;
    bottom: 14px;
    font-size: 11px;
    color: $ink-300;
    font-family: $font-mono;
  }

  &__images {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  &__img-item {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: $radius-md;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__img-remove {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(20, 32, 26, 0.6);
    color: $cream-50;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background .3s;

    &:hover { background: $danger; }
  }

  &__img-add {
    width: 100px;
    height: 100px;
    border-radius: $radius-md;
    border: 1.5px dashed $cream-400;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
    color: $ink-400;
    transition: all .3s $ease-soft;

    span { font-size: 10px; }
    &:hover {
      border-color: $ink-800;
      color: $ink-800;
    }
  }

  &__hint {
    font-size: 11px;
    color: $ink-300;
    margin-top: 8px;
  }

  &__tag-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__tag-btn {
    padding: 7px 16px;
    border-radius: $radius-pill;
    background: $cream-200;
    font-size: 12px;
    color: $ink-600;
    cursor: pointer;
    transition: all .3s $ease-fluid;

    &--active {
      background: $ink-900;
      color: $cream-50;
    }
    &:hover:not(&--active) { background: $cream-300; }
  }

  &__error {
    padding: 12px 16px;
    border-radius: $radius-md;
    background: rgba(178, 58, 42, 0.08);
    color: $danger;
    font-size: 13px;
    margin-bottom: 20px;
  }

  &__submit-row {
    display: flex;
    gap: 12px;
    margin-top: 32px;
  }

  &__submit {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 14px 36px;
    border-radius: $radius-pill;
    background: $ink-900;
    color: $cream-50;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all .4s $ease-fluid;

    &:hover { background: $accent-caramel; transform: translateY(-1px); }
    &:active { transform: scale(0.98); }
    &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  }

  &__draft {
    padding: 14px 28px;
    border-radius: $radius-pill;
    border: 1.5px solid $ink-800;
    color: $ink-800;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all .3s $ease-fluid;

    &:hover {
      background: $ink-900;
      color: $cream-50;
    }
  }
}

@media (max-width: 768px) {
  .publish {
    padding: 24px 16px 48px;
    &__form-inner { padding: 24px; }
    &__row, &__row--3 { grid-template-columns: 1fr; }
  }
}
</style>
