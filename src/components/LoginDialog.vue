<template>
  <el-dialog
    v-model="userStore.showLogin"
    width="460px"
    :show-close="false"
    class="login-dialog"
    align-center
    destroy-on-close
  >
    <div class="login">
      <div class="login__head">
        <div class="login__logo-mark">G</div>
        <h2 class="login__title">欢迎回来</h2>
        <p class="login__subtitle">登录拾光集，继续你的校园好物之旅</p>
      </div>

      <div class="login__form">
        <div class="login__field">
          <label>学号 / 用户名</label>
          <input v-model="form.username" type="text" placeholder="请输入学号或用户名" @keyup.enter="onLogin" />
        </div>
        <div class="login__field">
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" @keyup.enter="onLogin" />
        </div>

        <div v-if="error" class="login__error">{{ error }}</div>

        <button class="login__submit" @click="onLogin" :disabled="loading">
          <span v-if="loading">登录中...</span>
          <span v-else>登 录</span>
        </button>
      </div>

      <div class="login__footer">
        还没有账号？
        <button class="login__switch" @click="switchToRegister">立即注册</button>
      </div>

      <div class="login__demo">
        <span>测试账号：admin / 123456</span>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const form = reactive({ username: '', password: '' })
const error = ref('')
const loading = ref(false)

async function onLogin() {
  if (!form.username.trim()) { error.value = '请输入用户名'; return }
  if (!form.password.trim()) { error.value = '请输入密码'; return }
  loading.value = true
  error.value = ''
  try {
    await userStore.login(form.username, form.password)
  } catch (e) {
    error.value = e.message || '登录失败'
  } finally {
    loading.value = false
  }
}

function switchToRegister() {
  userStore.showLogin = false
  userStore.showRegister = true
}
</script>

<style lang="scss" scoped>
.login {
  padding: 8px 0;

  &__head {
    text-align: center;
    margin-bottom: 32px;
  }

  &__logo-mark {
    width: 56px;
    height: 56px;
    border-radius: $radius-md;
    background: $ink-800;
    color: $cream-50;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: $font-display;
    font-size: 28px;
    font-style: italic;
    transform: rotate(-6deg);
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

  &__form {
    margin-bottom: 20px;
  }

  &__field {
    margin-bottom: 16px;

    label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: $ink-400;
      margin-bottom: 6px;
    }

    input {
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

      &::placeholder { color: $ink-300; }

      &:focus {
        border-color: $ink-800;
        background: $cream-50;
        box-shadow: 0 0 0 3px rgba(31, 58, 46, 0.08);
      }
    }
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
    background: $ink-900;
    color: $cream-50;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.1em;
    transition: all .4s $ease-fluid;
    cursor: pointer;

    &:hover { background: $accent-caramel; transform: translateY(-1px); }
    &:active { transform: scale(0.98); }
    &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  }

  &__footer {
    text-align: center;
    font-size: 13px;
    color: $ink-400;
    margin-bottom: 16px;
  }

  &__switch {
    color: $accent-caramel;
    font-weight: 600;
    cursor: pointer;
    margin-left: 4px;
  }

  &__demo {
    text-align: center;
    padding: 10px;
    border-radius: $radius-sm;
    background: $cream-200;
    font-size: 12px;
    color: $ink-400;
    font-family: $font-mono;
  }
}

:deep(.el-dialog) {
  border-radius: $radius-xl;
  background: $cream-50;
  box-shadow: $shadow-strong;
  overflow: hidden;
}
:deep(.el-dialog__header) { display: none; }
:deep(.el-dialog__body) { padding: 40px 36px; }
:deep(.el-overlay) { backdrop-filter: blur(6px); background: rgba(20, 32, 26, 0.4); }
</style>
