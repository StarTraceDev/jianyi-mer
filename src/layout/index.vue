<!--
 * @Description: layout 布局
 * @Author: StarTraceDev
 * @Date: 2025-08-01 14:09:10
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-09-01 16:30:20
-->
<template>
  <div class="common-layout">
    <el-container>
      <el-aside :width="widthNav + 'px'" class="flex" v-if="dynamic">
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
import { ref, watch } from 'vue'
import { useWindowResize } from '@/utils/useWindowResize'

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

/**
 * 响应式布局
 * @returns {boolean} - 是否为动态布局
 * @returns {Ref<number>} - 窗口宽度
 */
const { width } = useWindowResize()
const dynamic = ref<boolean>(true)

watch(width, (newWidth) => {
  dynamic.value = newWidth >= 1000;
}, { immediate: true });

defineOptions({ name: 'TagNav' })
</script>

<style lang='scss' scoped>
.common-layout {
  height: 100vh;
}

.el-header {
  --el-header-padding: 0 0px;
}

:deep(.el-aside) {
  transition: width 0.3s ease;
}
</style>
