<template>
  <div class="image-uploader">
    <div class="image-uploader__list">
      <div
        v-for="(img, idx) in modelValue"
        :key="idx"
        class="image-uploader__item"
      >
        <img :src="img" alt="" />
        <button class="image-uploader__remove" @click="remove(idx)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <span v-if="idx === 0" class="image-uploader__cover">封面</span>
      </div>

      <label v-if="modelValue.length < max" class="image-uploader__add">
        <input type="file" accept="image/*" multiple @change="onUpload" />
        <span class="image-uploader__add-icon">+</span>
        <span class="image-uploader__add-text">添加图片</span>
        <span class="image-uploader__add-count">{{ modelValue.length }}/{{ max }}</span>
      </label>
    </div>
    <p class="image-uploader__hint">支持 jpg / png，第一张作为封面，最多 {{ max }} 张</p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  max: { type: Number, default: 6 }
})
const emit = defineEmits(['update:modelValue'])

function onUpload(e) {
  const files = Array.from(e.target.files || [])
  const remain = props.max - props.modelValue.length
  const slice = files.slice(0, remain)
  const reads = slice.map(f => readAsBase64(f))
  Promise.all(reads).then(arr => {
    emit('update:modelValue', [...props.modelValue, ...arr])
    e.target.value = ''
  })
}

function readAsBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })
}

function remove(idx) {
  const list = [...props.modelValue]
  list.splice(idx, 1)
  emit('update:modelValue', list)
}
</script>

<style lang="scss" scoped>
.image-uploader {
  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }

  &__item {
    position: relative;
    aspect-ratio: 1;
    border-radius: $radius-md;
    overflow: hidden;
    background: $cream-200;
    transition: transform .35s $ease-spring;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &:hover {
      transform: scale(1.02);
    }
  }

  &__remove {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(20, 32, 26, 0.7);
    backdrop-filter: blur(6px);
    color: $cream-50;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .3s $ease-fluid;
    cursor: pointer;

    svg { width: 12px; height: 12px; }

    &:hover {
      background: $danger;
      transform: scale(1.1);
    }
  }

  &__cover {
    position: absolute;
    bottom: 6px;
    left: 6px;
    padding: 2px 8px;
    border-radius: $radius-pill;
    background: $accent-caramel;
    color: $cream-50;
    font-size: 10px;
    font-weight: 700;
  }

  &__add {
    position: relative;
    aspect-ratio: 1;
    border-radius: $radius-md;
    border: 2px dashed $cream-400;
    background: $cream-100;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
    transition: all .35s $ease-fluid;

    input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }

    &-icon {
      font-size: 32px;
      color: $ink-300;
      line-height: 1;
      font-weight: 300;
    }

    &-text {
      font-size: 12px;
      color: $ink-400;
    }

    &-count {
      font-size: 10px;
      color: $ink-300;
      font-family: $font-mono;
    }

    &:hover {
      border-color: $accent-caramel;
      background: $cream-50;

      .image-uploader__add-icon { color: $accent-caramel; }
    }
  }

  &__hint {
    margin-top: 12px;
    font-size: 12px;
    color: $ink-400;
  }
}
</style>
