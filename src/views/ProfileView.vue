<template>
  <div class="profile">
    <div class="profile__container">
      <!-- 用户信息卡 -->
      <div class="profile__hero">
        <div class="profile__hero-bg">
          <span class="profile__hero-bg-text">PROFILE · {{ user?.nickname?.toUpperCase() }}</span>
        </div>
        <div class="profile__hero-content">
          <img :src="userStore.avatar" alt="" class="profile__avatar" />
          <div class="profile__user-info">
            <div class="profile__nick-row">
              <h1 class="profile__nickname">{{ user?.nickname }}</h1>
              <span class="profile__campus">{{ user?.campus }}</span>
            </div>
            <p class="profile__sub">@{{ user?.username }} · 加入于 {{ joinDate }}</p>
          </div>
          <div class="profile__stats">
            <div class="profile__stat">
              <strong>{{ publishCount }}</strong>
              <span>发布</span>
            </div>
            <div class="profile__stat">
              <strong>{{ orderCount }}</strong>
              <span>订单</span>
            </div>
            <div class="profile__stat">
              <strong>{{ favCount }}</strong>
              <span>收藏</span>
            </div>
            <div class="profile__stat">
              <strong>{{ chatCount }}</strong>
              <span>私信</span>
            </div>
          </div>
          <button class="profile__logout" @click="onLogout">退出登录</button>
          <button class="profile__edit-btn" @click="openEdit">编辑资料</button>
        </div>
      </div>

      <!-- 编辑资料弹窗 -->
      <el-dialog v-model="showEdit" width="460px" :show-close="false" class="edit-dialog" align-center destroy-on-close>
        <div class="edit-profile">
          <div class="edit-profile__head">
            <div class="edit-profile__logo-mark">G</div>
            <h2>编辑资料</h2>
            <p>修改你的头像和昵称</p>
          </div>

          <div class="edit-profile__avatar-section">
            <div class="edit-profile__avatar-wrap">
              <img :src="editForm.avatar || user?.avatar" alt="" />
              <label class="edit-profile__avatar-btn">
                <input type="file" accept="image/*" @change="onAvatarChange" />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                <span>更换头像</span>
              </label>
            </div>
          </div>

          <div class="edit-profile__field">
            <label>昵称</label>
            <input v-model="editForm.nickname" type="text" placeholder="输入新昵称" maxlength="20" />
            <span class="edit-profile__count">{{ (editForm.nickname || '').length }}/20</span>
          </div>

          <div class="edit-profile__field">
            <label>校区</label>
            <select v-model="editForm.campus">
              <option v-for="c in campuses" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <div v-if="editError" class="edit-profile__error">{{ editError }}</div>

          <div class="edit-profile__actions">
            <button class="edit-profile__cancel" @click="showEdit = false">取消</button>
            <button class="edit-profile__save" @click="onSaveProfile" :disabled="saving">
              {{ saving ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </el-dialog>

      <!-- 页签 + 内容 -->
      <div class="profile__main">
        <nav class="profile__nav">
          <router-link to="/profile/publish" class="profile__nav-item">
            <span class="profile__nav-icon">◐</span>
            <div>
              <div class="profile__nav-name">我的发布</div>
              <div class="profile__nav-desc">管理在售商品</div>
            </div>
          </router-link>
          <router-link to="/profile/orders" class="profile__nav-item">
            <span class="profile__nav-icon">◈</span>
            <div>
              <div class="profile__nav-name">我的订单</div>
              <div class="profile__nav-desc">购买/交易记录</div>
            </div>
          </router-link>
          <router-link to="/profile/favorite" class="profile__nav-item">
            <span class="profile__nav-icon">♡</span>
            <div>
              <div class="profile__nav-name">我的收藏</div>
              <div class="profile__nav-desc">心仪的好物</div>
            </div>
          </router-link>
          <router-link to="/profile/chats" class="profile__nav-item">
            <span class="profile__nav-icon">⌬</span>
            <div>
              <div class="profile__nav-name">私信</div>
              <div class="profile__nav-desc">与同学的对话</div>
            </div>
          </router-link>
          <router-link to="/profile/messages" class="profile__nav-item">
            <span class="profile__nav-icon">◎</span>
            <div>
              <div class="profile__nav-name">站内消息</div>
              <div class="profile__nav-desc">系统通知</div>
            </div>
          </router-link>
        </nav>

        <div class="profile__content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useFavoriteStore } from '@/stores/favorite'
import { useMessageStore } from '@/stores/message'
import { useItemStore } from '@/stores/item'
import { useOrderStore } from '@/stores/order'
import { useChatStore } from '@/stores/chat'
import dayjs from 'dayjs'

const userStore = useUserStore()
const favStore = useFavoriteStore()
const msgStore = useMessageStore()
const itemStore = useItemStore()
const orderStore = useOrderStore()
const chatStore = useChatStore()
const router = useRouter()

const user = computed(() => userStore.currentUser)
const joinDate = computed(() => user.value ? dayjs(user.value.createTime).format('YYYY.MM') : '')

const publishCount = computed(() => itemStore.myPublished.length)
const orderCount = computed(() => orderStore.getMyOrders(userStore.userId).length)
const favCount = computed(() => favStore.count)
const chatCount = computed(() => chatStore.getMyConversations(userStore.userId).length)

const campuses = ['中心校区', '东校区', '南校区', '西校区', '北校区']

const showEdit = ref(false)
const saving = ref(false)
const editError = ref('')
const editForm = reactive({
  nickname: '',
  campus: '',
  avatar: ''
})

function openEdit() {
  editForm.nickname = user.value?.nickname || ''
  editForm.campus = user.value?.campus || '中心校区'
  editForm.avatar = ''
  editError.value = ''
  showEdit.value = true
}

function onAvatarChange(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    editError.value = '头像图片不能超过 2MB'
    return
  }
  const reader = new FileReader()
  reader.onload = (ev) => {
    editForm.avatar = ev.target.result
  }
  reader.readAsDataURL(file)
}

function onSaveProfile() {
  if (!editForm.nickname.trim()) {
    editError.value = '昵称不能为空'
    return
  }
  editError.value = ''
  saving.value = true

  const payload = {
    nickname: editForm.nickname.trim(),
    campus: editForm.campus
  }
  if (editForm.avatar) {
    payload.avatar = editForm.avatar
  }

  setTimeout(() => {
    userStore.updateProfile(payload)
    saving.value = false
    showEdit.value = false
    ElMessage.success('资料已更新')
  }, 300)
}

function onLogout() {
  userStore.logout()
  router.push('/')
}
</script>

<style lang="scss" scoped>
.profile {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 32px 80px;

  &__hero {
    position: relative;
    padding: 40px 48px;
    border-radius: $radius-xl;
    background: $ink-900;
    color: $cream-50;
    overflow: hidden;
    margin-bottom: 32px;
  }

  &__hero-bg {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    overflow: hidden;
    pointer-events: none;

    &-text {
      font-family: $font-display;
      font-style: italic;
      font-size: clamp(80px, 14vw, 200px);
      color: rgba(253, 251, 246, 0.04);
      letter-spacing: -0.04em;
      white-space: nowrap;
      transform: translateX(-10%);
    }
  }

  &__hero-content {
    position: relative;
    display: flex;
    align-items: center;
    gap: 24px;
  }

  &__avatar {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: $cream-300;
    object-fit: cover;
    border: 3px solid $accent-caramel;
  }

  &__user-info {
    flex: 1;
  }

  &__nick-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;
  }

  &__nickname {
    font-family: $font-display;
    font-size: 32px;
    color: $cream-50;
  }

  &__campus {
    padding: 4px 12px;
    border-radius: $radius-pill;
    background: rgba(253, 251, 246, 0.12);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  &__sub {
    font-size: 13px;
    color: $cream-400;
    font-family: $font-mono;
  }

  &__stats {
    display: flex;
    gap: 32px;
    padding: 0 32px;
    border-left: 1px solid rgba(253, 251, 246, 0.1);
    border-right: 1px solid rgba(253, 251, 246, 0.1);
  }

  &__stat {
    text-align: center;

    strong {
      display: block;
      font-family: $font-display;
      font-size: 32px;
      line-height: 1;
      color: $cream-50;
    }
    span {
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: $cream-400;
      margin-top: 6px;
      display: inline-block;
    }
  }

  &__logout {
    padding: 10px 22px;
    border-radius: $radius-pill;
    border: 1.5px solid rgba(253, 251, 246, 0.2);
    color: $cream-200;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all .3s $ease-fluid;

    &:hover {
      background: $accent-caramel;
      border-color: $accent-caramel;
      color: $cream-50;
    }
  }

  &__edit-btn {
    padding: 10px 22px;
    border-radius: $radius-pill;
    border: 1.5px solid $accent-caramel;
    background: $accent-caramel;
    color: $cream-50;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all .3s $ease-fluid;

    &:hover {
      background: $accent-rust;
      border-color: $accent-rust;
      transform: translateY(-1px);
    }
  }

  &__main {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 24px;
    align-items: flex-start;
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 16px;
    border-radius: $radius-xl;
    background: $cream-50;
    border: 1px solid rgba(20, 32, 26, 0.06);
    box-shadow: $shadow-soft;
    position: sticky;
    top: 110px;

    &-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      border-radius: $radius-md;
      color: $ink-600;
      transition: all .35s $ease-fluid;
      cursor: pointer;

      &.router-link-active {
        background: $ink-900;
        color: $cream-50;

        .profile__nav-icon { color: $accent-caramel; }
        .profile__nav-desc { color: $cream-400; }
      }

      &:not(.router-link-active):hover {
        background: $cream-200;
      }
    }

    &-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: $cream-200;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: $font-display;
      font-size: 18px;
      color: $accent-caramel;
      flex-shrink: 0;
    }

    &-item.router-link-active &-icon {
      background: rgba(200, 99, 43, 0.15);
    }

    &-name {
      font-size: 14px;
      font-weight: 600;
    }
    &-desc {
      font-size: 11px;
      color: $ink-400;
    }
  }

  &__content {
    padding: 32px;
    border-radius: $radius-xl;
    background: $cream-50;
    border: 1px solid rgba(20, 32, 26, 0.06);
    box-shadow: $shadow-soft;
    min-height: 400px;
  }
}

.edit-profile {
  padding: 8px 0;

  &__head {
    text-align: center;
    margin-bottom: 28px;
  }

  &__logo-mark {
    width: 48px;
    height: 48px;
    border-radius: $radius-md;
    background: $accent-caramel;
    color: $cream-50;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: $font-display;
    font-size: 24px;
    font-style: italic;
    transform: rotate(6deg);
    margin-bottom: 14px;
  }

  &__head h2 {
    font-family: $font-display;
    font-size: 26px;
    color: $ink-900;
    margin-bottom: 6px;
  }

  &__head p {
    font-size: 14px;
    color: $ink-400;
  }

  &__avatar-section {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
  }

  &__avatar-wrap {
    position: relative;

    img {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: $cream-300;
      object-fit: cover;
      border: 3px solid $cream-200;
    }
  }

  &__avatar-btn {
    position: absolute;
    bottom: 0;
    right: -8px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 5px 10px;
    border-radius: $radius-pill;
    background: $ink-900;
    color: $cream-50;
    font-size: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all .3s $ease-fluid;
    white-space: nowrap;

    input {
      display: none;
    }

    &:hover {
      background: $accent-caramel;
      transform: scale(1.05);
    }
  }

  &__field {
    margin-bottom: 18px;
    position: relative;

    label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: $ink-400;
      margin-bottom: 8px;
    }

    input, select {
      width: 100%;
      padding: 12px 16px;
      border-radius: $radius-md;
      border: 1.5px solid $cream-300;
      background: $cream-100;
      font-size: 14px;
      color: $ink-900;
      outline: none;
      box-sizing: border-box;
      font-family: $font-sans;
      transition: all .3s $ease-soft;

      &:focus {
        border-color: $ink-800;
        background: $cream-50;
      }
    }

    select {
      cursor: pointer;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7F73' stroke-width='1.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px;
      padding-right: 36px;
    }
  }

  &__count {
    position: absolute;
    right: 12px;
    bottom: 12px;
    font-size: 11px;
    color: $ink-300;
    font-family: $font-mono;
  }

  &__error {
    padding: 10px 14px;
    border-radius: $radius-sm;
    background: rgba(178, 58, 42, 0.08);
    color: $danger;
    font-size: 13px;
    margin-bottom: 16px;
  }

  &__actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
  }

  &__cancel {
    flex: 1;
    padding: 12px;
    border-radius: $radius-pill;
    border: 1.5px solid $cream-400;
    background: transparent;
    color: $ink-600;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all .3s $ease-fluid;

    &:hover { background: $cream-200; }
  }

  &__save {
    flex: 1;
    padding: 12px;
    border-radius: $radius-pill;
    background: $ink-900;
    color: $cream-50;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all .4s $ease-fluid;

    &:hover { background: $accent-caramel; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
}

:deep(.edit-dialog .el-dialog) {
  border-radius: $radius-xl;
  background: $cream-50;
  box-shadow: $shadow-strong;
  overflow: hidden;
}
:deep(.edit-dialog .el-dialog__header) { display: none; }
:deep(.edit-dialog .el-dialog__body) { padding: 36px; }
:deep(.edit-dialog .el-overlay) { backdrop-filter: blur(6px); background: rgba(20, 32, 26, 0.4); }

@media (max-width: 1024px) {
  .profile__hero-content { flex-wrap: wrap; }
  .profile__stats { padding: 0; border: none; gap: 24px; }
  .profile__main { grid-template-columns: 1fr; }
  .profile__nav {
    position: static;
    flex-direction: row;
    overflow-x: auto;
    flex-wrap: wrap;
  }
  .profile__nav-item { flex: 1; min-width: 200px; }
}
@media (max-width: 768px) {
  .profile { padding: 16px; }
  .profile__hero { padding: 24px; }
}
</style>
