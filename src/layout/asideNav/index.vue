<!--
 * @Description: 左侧导航
 * @Author: StarTraceDev
 * @Date: 2025-08-04 11:26:10
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-04 23:08:09
-->
<template>
  <div class="w-[80px] bg-[#282c34] text-white h-screen">
    <div>logo</div>
    <div class="menu-container" :class="{ 'bg-[#4073fa]': activeId === item.id }"
      v-for="(item, index) in authStore.menuRoutes" :key="index + '-' + item.id" @click="targetNavigation(item)">
      <el-icon :class="item.icon">
        <List />
      </el-icon>
      <div>{{ item.title }}</div>
    </div>
  </div>
  <SubMenu :subNavigation="subNavigation" />
</template>

<script setup lang='ts'>
import SubMenu from './submenu/index.vue'
import { List } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/authStore'
import { ref, onMounted } from 'vue'
import type { RouteMenu } from '@/types/routers'

const authStore = useAuthStore()
const activeId = ref<number>(0)
const subNavigation = ref<RouteMenu>()

onMounted(() => {
  const data = JSON.parse(localStorage.getItem('tagNaveListJavaMer') as string)
  if (data && data.id) {
    targetNavigation(data)
    activeId.value = data.id
  }
});

const targetNavigation = (item: RouteMenu) => {
  subNavigation.value = item
  activeId.value = item.id
}


defineOptions({ name: 'LayoutAsideNav' })
</script>

<style scoped>
.menu-container {
  @apply flex items-center justify-center h-[50px];
  transition: .3s ease-in-out;
}
</style>
