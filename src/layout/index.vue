<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Description: 当前页面描述
 * @Author: StarTraceDev
 * @Date: 2025-08-01 14:09:10
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-07 17:28:16
-->
<template>
  <div class="common-layout">
    <el-container>
      <el-aside :width="widthNav + 'px'" class="flex">
        <MainMenu :closeNav="closeNav" />
      </el-aside>
      <el-container>
        <el-header height="84px">
          <MainNav @foldClick="closeNavigation" />
        </el-header>
        <el-main class="bg-[#f0f2f5]">
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang='ts'>
import MainMenu from './mainMenu/index.vue'
import MainNav from './mainNav/index.vue'
import { RouterView } from 'vue-router'
import { ref } from 'vue'

const widthNav = ref<number>(260)
const closeNav = ref<boolean>()
/**
 * 关闭导航
 * @param {boolean} value
 */
const closeNavigation = (value: boolean) => {
  widthNav.value = value ? 80 : 260
  closeNav.value = value
}
</script>

<style lang='scss' scoped>
.common-layout {
  height: 100vh;
}

.el-header {
  --el-header-padding: 0 0px;
}
</style>
