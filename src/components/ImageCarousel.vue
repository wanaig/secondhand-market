<template>
  <div class="image-carousel">
    <div class="image-carousel__main">
      <transition :name="direction" mode="out-in">
        <img
          :key="currentIdx"
          :src="images[currentIdx]"
          :alt="`图片 ${currentIdx + 1}`"
        />
      </transition>
      <button v-if="images.length > 1" class="image-carousel__nav image-carousel__nav--prev" @click="prev" aria-label="上一张">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 18 9 12l6-6"/></svg>
      </button>
      <button v-if="images.length > 1" class="image-carousel__nav image-carousel__nav--next" @click="next" aria-label="下一张">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m9 18 6-6-6-6"/></svg>
      </button>
      <div class="image-carousel__counter">
        {{ currentIdx + 1 }} / {{ images.length }}
      </div>
    </div>
    <div v-if="images.length > 1" class="image-carousel__thumbs">
      <button
        v-for="(img, idx) in images"
        :key="idx"
        class="image-carousel__thumb"
        :class="{ 'image-carousel__thumb--active': idx === currentIdx }"
        @click="setIndex(idx)"
      >
        <img :src="img" alt="" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  images: { type: Array, default: () => [] }
})

const currentIdx = ref(0)
const direction = ref('slide-next')

function setIndex(i) {
  direction.value = i > currentIdx.value ? 'slide-next' : 'slide-prev'
  currentIdx.value = i
}
function next() {
  direction.value = 'slide-next'
  currentIdx.value = (currentIdx.value + 1) % props.images.length
}
function prev() {
  direction.value = 'slide-prev'
  currentIdx.value = (currentIdx.value - 1 + props.images.length) % props.images.length
}
</script>

<style lang="scss" scoped>
.image-carousel {
  &__main {
    position: relative;
    aspect-ratio: 1;
    border-radius: $radius-xl;
    overflow: hidden;
    background: $cream-200;
    box-shadow: $shadow-medium;

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(253, 251, 246, 0.85);
    backdrop-filter: blur(8px);
    color: $ink-900;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .35s $ease-fluid;
    opacity: 0;

    svg { width: 20px; height: 20px; }

    &--prev { left: 16px; }
    &--next { right: 16px; }

    &:hover {
      background: $cream-50;
      transform: translateY(-50%) scale(1.08);
    }
  }
  &__main:hover &__nav { opacity: 1; }

  &__counter {
    position: absolute;
    bottom: 16px;
    right: 16px;
    padding: 4px 12px;
    border-radius: $radius-pill;
    background: rgba(20, 32, 26, 0.7);
    backdrop-filter: blur(8px);
    color: $cream-50;
    font-family: $font-mono;
    font-size: 11px;
    letter-spacing: 0.05em;
  }

  &__thumbs {
    display: flex;
    gap: 10px;
    margin-top: 14px;
    overflow-x: auto;
    padding-bottom: 4px;

    &::-webkit-scrollbar { height: 4px; }
  }

  &__thumb {
    flex: 0 0 80px;
    height: 80px;
    border-radius: $radius-md;
    overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all .35s $ease-fluid;
    padding: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &--active {
      border-color: $accent-caramel;
      transform: scale(0.96);
    }
    &:hover:not(&--active) {
      border-color: $cream-400;
    }
  }
}

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: all .5s $ease-fluid;
}
.slide-next-enter-from { opacity: 0; transform: translateX(40px); }
.slide-next-leave-to   { opacity: 0; transform: translateX(-40px); }
.slide-prev-enter-from { opacity: 0; transform: translateX(-40px); }
.slide-prev-leave-to   { opacity: 0; transform: translateX(40px); }
</style>
