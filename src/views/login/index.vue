<!--
 * @Description: 登录页
 * @Author: StarTraceDev
 * @Date: 2025-07-31 10:58:15
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-06 09:34:13
-->
<template>
  <div v-loading="loading" element-loading-background="#fff" element-loading-text="加载中..."
    style="width: 100vw; height: 100vh">
    <div ref="container"></div>
    <div v-if="!loading" class="login bg-none bg-repeat" :style="{ backgroundImage: `url(${backgroundImage})` }">
      <div class="login-shade w-full h-full flex items-center justify-center">
        <div class="w-[670px] flex bg-white z-999 rounded-md">
          <div class="w-[268px]">
            <img :src="leftLogo">
          </div>
          <div class="w-[384px] px-[40px]">
            <div class="flex justify-center pt-[50px]">
              <img :src="loginLogo" class="size-[100px]">
            </div>
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
              <el-form-item prop="account">
                <el-input :prefix-icon="User" v-model="ruleForm.account" placeholder="管理员" />
              </el-form-item>
              <el-form-item prop="pwd">
                <el-input v-model="ruleForm.pwd" :prefix-icon="Lock" type="password" placeholder="密码" show-password />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm(ruleFormRef)"> 确定 </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CanvasNest from './components/canvas-nest'
import { loginApi } from '@/api/login'
import { User, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import type { FormInstance, FormRules } from 'element-plus'
import type { BackdropImg, RuleForm, LoginResponse } from './components/index'
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'

// 获取登录页背景
const loading = ref<boolean>(true)
const backdropImg = ref<BackdropImg>()

const loginBkgImg = async () => {
  const { data } = await loginApi.getLoginPicApi()
  loading.value = false
  backdropImg.value = data as BackdropImg
}

/**
 * 创建图像计算属性
 * @param {keyof BackdropImg} key - 检索背景对象的键
 * @param {string} [fallback=''] - 无效图像时使用的默认图像
 * @returns {ComputedRef<string>} - 图像的计算属性
 */
const createImageGetter = (key: keyof BackdropImg, fallback = '') => computed<string>(() => backdropImg.value?.[key] || fallback)

const leftLogo = createImageGetter('leftLogo');
const backgroundImage = createImageGetter('backgroundImage');
const loginLogo = createImageGetter('loginLogo');

// 画布
const container = ref<HTMLElement | null>(null)
let canvasNest: CanvasNest | null = null

onMounted(() => {
  if (container.value) {
    canvasNest = new CanvasNest(container.value, {
      color: '255,255,255', // 蓝色线条
      count: 240, // 粒子数量
      opacity: 0.7, // 透明度
      zIndex: '100', // 层级
    })
  }
})

onBeforeUnmount(() => {
  if (canvasNest) {
    canvasNest.destroy()
  }
})

loginBkgImg()

// 登录
const router = useRouter()
const authStore = useAuthStore()
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  account: 'shijianxiaopu',
  pwd: '000000',
})

const rules = reactive<FormRules<RuleForm>>({
  account: [{ required: true, message: '请输入管理员', trigger: 'blur' }],
  pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const response = await loginApi.login(ruleForm)
      const { code, data } = response as LoginResponse;
      if (code === 200) {
        authStore.loginSuccess(data.token)
        authStore.fetchUserInfo()
        const redirect = router.currentRoute.value.query.redirect as string || '/'
        router.push(redirect)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
defineOptions({
  name: 'LoginIndex',
})
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  &-shade {
    background: rgba(0, 0, 0, 0.45) !important;
  }
}
</style>
