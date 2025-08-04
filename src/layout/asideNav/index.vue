<!--
 * @Description: 左侧导航
 * @Author: StarTraceDev
 * @Date: 2025-08-04 11:26:10
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-04 17:42:11
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HomeFilled, List } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/authStore'
import { ref, onMounted } from 'vue'
import type { RouteMenu } from '@/types/routers'


const authStore = useAuthStore()
const activeId = ref<number>(0)
const subNavigation = ref<RouteMenu>()

console.log(authStore.menuRoutes);

onMounted(() => {
  console.log(123);

  const data = JSON.parse(localStorage.getItem('tagNaveListJavaMer') as string)
  console.log(data);
  activeId.value = data.id
  // if (authStore.menuRoutes.length > 0) {
  //   activeId.value = authStore.menuRoutes[0].id;
  // }
});
console.log();

const targetNavigation = (item: RouteMenu) => {
  subNavigation.value = item
  activeId.value = item.id
  console.log(item.id, item);
}


defineOptions({ name: 'LayoutAsideNav' })
</script>

<style scoped>
.menu-container {
  @apply flex items-center justify-center h-[50px];
  transition: .3s ease-in-out;
}
</style>
