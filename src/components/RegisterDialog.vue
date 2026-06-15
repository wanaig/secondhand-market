<template>
  <el-dialog
    v-model="userStore.showRegister"
    width="460px"
    :show-close="false"
    class="login-dialog"
    align-center
    destroy-on-close
  >
    <div class="register">
      <div class="register__head">
        <div class="register__logo-mark">G</div>
        <h2 class="register__title">加入拾光集</h2>
        <p class="register__subtitle">创建账号，开启校园好物交易之旅</p>
      </div>

      <div class="register__form">
        <div class="register__field">
          <label>学号 / 用户名</label>
          <input v-model="form.username" type="text" placeholder="用于登录，不可修改" />
        </div>
        <div class="register__field">
          <label>昵称</label>
          <input v-model="form.nickname" type="text" placeholder="展示给其他同学的名字" />
        </div>
        <div class="register__row">
          <div class="register__field">
            <label>密码</label>
            <input v-model="form.password" type="password" placeholder="至少6位" />
          </div>
          <div class="register__field">
            <label>确认密码</label>
            <input v-model="form.confirmPwd" type="password" placeholder="再次输入" />
          </div>
        </div>
        <div class="register__field">
          <label>校区</label>
          <select v-model="form.campus">
            <option value="">请选择校区</option>
            <option v-for="c in campuses" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div class="register__field">
          <label>手机号（选填）</label>
          <input v-model="form.phone" type="tel" placeholder="方便同学联系你" />
        </div>

        <div v-if="error" class="register__error">{{ error }}</div>

        <button class="register__submit" @click="onRegister" :disabled="loading">
          <span v-if="loading">注册中...</span>
          <span v-else>注 册</span>
        </button>
      </div>

      <div class="register__footer">
        已有账号？
        <button class="register__switch" @click="switchToLogin">去登录</button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const campuses = ['中心校区', '东校区', '南校区', '西校区', '北校区']
const form = reactive({ username: '', nickname: '', password: '', confirmPwd: '', campus: '', phone: '' })
const error = ref('')
const loading = ref(false)

async function onRegister() {
  if (!form.username.trim()) { error.value = '请输入用户名'; return }
  if (!form.password || form.password.length < 6) { error.value = '密码至少6位'; return }
  if (form.password !== form.confirmPwd) { error.value = '两次密码不一致'; return }
  loading.value = true
  error.value = ''
  try {
    await userStore.register(form)
  } catch (e) {
    error.value = e.message || '注册失败'
  } finally {
    loading.value = false
  }
}

function switchToLogin() {
  userStore.showRegister = false
  userStore.showLogin = true
}
</script>

<style lang="scss" scoped>
.register {
  padding: 8px 0;

  &__head {
    text-align: center;
    margin-bottom: 28px;
  }

  &__logo-mark {
    width: 56px;
    height: 56px;
    border-radius: $radius-md;
    background: $accent-caramel;
    color: $cream-50;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: $font-display;
    font-size: 28px;
    font-style: italic;
    transform: rotate(6deg);
    margin-bottom: 16px;
  }

  &__title {
    font-family: $font-display;
    font-size: 28px;
    color: $ink-900;
    margin-bottom: 8px;
  }

  &__subtitle {
    font-size: 14px;
    color: $ink-400;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  &__form {
    margin-bottom: 16px;
  }

  &__field {
    margin-bottom: 14px;

    label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: $ink-400;
      margin-bottom: 6px;
    }

    input, select {
      width: 100%;
      padding: 11px 14px;
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

    select { cursor: pointer; appearance: none; }
  }

  &__error {
    padding: 10px 14px;
    border-radius: $radius-sm;
    background: rgba(178, 58, 42, 0.08);
    color: $danger;
    font-size: 13px;
    margin-bottom: 12px;
  }

  &__submit {
    width: 100%;
    padding: 14px;
    border-radius: $radius-pill;
    background: $accent-caramel;
    color: $cream-50;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.1em;
    transition: all .4s $ease-fluid;
    cursor: pointer;

    &:hover { background: $accent-rust; transform: translateY(-1px); }
    &:active { transform: scale(0.98); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }

  &__footer {
    text-align: center;
    font-size: 13px;
    color: $ink-400;
  }

  &__switch {
    color: $ink-800;
    font-weight: 600;
    cursor: pointer;
    margin-left: 4px;
  }
}
</style>
