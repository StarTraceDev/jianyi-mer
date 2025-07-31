<!--
 * @Description: 登录页
 * @Author: StarTraceDev
 * @Date: 2025-07-31 10:58:15
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-07-31 17:35:28
-->
<template>
  <div ref="container"></div>
  <div class="login bg-none bg-repeat" :style="{ backgroundImage: `url(${fULLImg})` }
    ">
    <div class="login-shade w-full h-full flex items-center justify-center">
      <div class="w-[670px] flex bg-white z-999">
        <div class="w-[268px]">123123</div>
        <div class="w-[384px] px-[40px] ">
          <div></div>
          <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
            <el-form-item prop="name">
              <el-input :prefix-icon="User" v-model="ruleForm.name" placeholder="管理员" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="ruleForm.password" :prefix-icon="Lock" type="password" placeholder="密码"
                show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm(ruleFormRef)"> Create </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CanvasNest from './components/canvas-nest'
import { login } from '@/api/login'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'

const container = ref<HTMLElement | null>(null)
let canvasNest: CanvasNest | null = null

interface BackdropImg {
  backgroundImage: string
  leftLogo: string
  loginLogo: string
  siteName: string
}
const backdropImg = ref<BackdropImg>()

// 获取登录图
const loginBkgImg = async () => {
  const { data } = await login.getLoginPicApi()
  backdropImg.value = data as BackdropImg
}
// 背景图
const fULLImg = computed((): string | undefined => {
  if (backdropImg.value) {
    const { backgroundImage } = backdropImg.value
    return backgroundImage
  }
  return '' // 替换图路径
})

// Logo
const fULLImg1 = computed((): string | undefined => {
  if (backdropImg.value) {
    const { leftLogo } = backdropImg.value
    return leftLogo
  }
  return '' // 替换图路径
})

// Logo
const fULLImg2 = computed((): string | undefined => {
  if (backdropImg.value) {
    const { loginLogo } = backdropImg.value
    return loginLogo
  }
  return '' // 替换图路径
})

console.log(fULLImg);

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
defineOptions({
  name: 'LoginIndex',
})

loginBkgImg()

interface RuleForm {
  name: string
  password: string
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  name: '',
  password: '',
})

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: '请输入管理员', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}
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
