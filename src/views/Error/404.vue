<!--
 * @Description: 404
 * @Author: StarTraceDev
 * @Date: 2025-08-01 13:23:42
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-09-01 14:01:57
-->
<template>
  <div class="bg-(--bg-container) w-svw h-svh">
    <div></div>
    <div>
      <p>OOPS!</p>
      <p>你不能进入这个页面...</p>
      <p>请检查您输入的URL是否正确，或单击下面的按钮返回主页.</p>
      <el-button type="primary" @click="handleReturn">返回控制台</el-button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router'

// 返回控制台
const router = useRouter()
const handleReturn = () => {
  router.push('/home/backgroundawait')
}

defineOptions({ name: 'viewsError404' })
</script>

<style lang='scss' scoped></style>
