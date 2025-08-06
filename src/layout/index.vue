<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Description: 当前页面描述
 * @Author: StarTraceDev
 * @Date: 2025-08-01 14:09:10
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-06 14:02:29
-->
<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="260px" class="flex">
        <MainMenu />
      </el-aside>
      <el-container>
        <el-header height="84px">
          <MainNav />
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
// import { ref, reactive } from 'vue'
import { RouterView } from 'vue-router'

</script>

<style lang='scss' scoped>
.common-layout {
  height: 100vh;
}

.el-header {
  --el-header-padding: 0 0px;
}
</style>
