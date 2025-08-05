<!--
 * @Description: 顶部导航
 * @Author: StarTraceDev
 * @Date: 2025-08-05 15:47:10
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-05 23:31:16
-->
<template>
  <div class="flex items-center justify-between h-[50px] border-b border-[#ebeef5]">
    <div class="flex items-center">
      <el-icon :size="18" class="icons">
        <Fold />
      </el-icon>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">订单</el-breadcrumb-item>
        <el-breadcrumb-item>直邮订单</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="flex items-center">
      <el-icon class="icon">
        <!-- screenfull -->
        <RefreshRight />
      </el-icon>

      <el-icon class="icon">
        <FullScreen />
      </el-icon>
      <div class="icon bg-[#4073FA] py-[3px] px-[8px] text-white rounded-[10px] text-[12px]">商城</div>
    </div>
  </div>
  <TabNav />
</template>

<script setup lang='ts'>
import TabNav from '../tagNav/index.vue';
import { RefreshRight, FullScreen, Fold } from '@element-plus/icons-vue'
// import { ref, reactive } from 'vue'

defineOptions({ name: 'MainNav' })
</script>

<style lang='scss' scoped>
.icons {
  margin: 0 15px;
}

.icon {
  margin: 0 10px;
}
</style>
