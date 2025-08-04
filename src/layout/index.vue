<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Description: 当前页面描述
 * @Author: StarTraceDev
 * @Date: 2025-08-01 14:09:10
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-04 10:52:23
-->
<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang='ts'>
// import { ref, reactive } from 'vue'
import { RouterView } from 'vue-router'

</script>

<style lang='scss' scoped></style>
