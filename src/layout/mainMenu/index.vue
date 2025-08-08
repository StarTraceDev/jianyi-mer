<!--
 * @Description: 左侧主菜单
 * @Author: StarTraceDev
 * @Date: 2025-08-04 11:26:10
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-08 17:46:45
-->
<template>
  <div class="w-[80px] bg-[#282c34] text-white h-screen m-[5px] border-b border-[#ebeef5]">
    <div class="py-[5px] flex justify-center">
      <img :src="userLogo" alt="" class="size-[50px]">
    </div>
    <div class="menu-container" :class="{ 'bg-[#4073fa]': activeId === item.id }" v-for="(item, index) in menuRoutes"
      :key="index + '-' + item.id" @click="targetNavigation(item, index, 'manual')">
      <el-icon :class="item.icon">
        <List />
      </el-icon>
      <div class="text-[13px]">{{ item.title }}</div>
    </div>
  </div>
  <Transition name="slide">
    <SubMenu :sub-navigation="subNavigation" :collapse-nav="props.closeNav" />
  </Transition>
</template>

<script setup lang='ts'>
import SubMenu from '../subMenu/index.vue'
import { List } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/authStore'
import { useTabsStore } from '@/stores/tabsStore'
import { ref, onMounted, computed, watch, defineProps } from 'vue'
import type { RouteMenu } from '@/types/routers'
import type { userStateInfo } from '@/types/stores'

const authStore = useAuthStore()
const tabsStore = useTabsStore()
const activeId = ref<number>(0)
const subNavigation = ref<RouteMenu>()

const props = defineProps({
  closeNav: {
    type: Boolean,
    default: false
  }
})
// 计算属性
const menuRoutes = computed(() => authStore.menuRoutes as RouteMenu[])
const userLogo = computed(() => {
  const info = authStore.userInfo as userStateInfo
  return info?.rectangleLogo || ''
})

// 监听 activeTab 变化
watch(() => tabsStore.activeTab, (newValue: string) => {
  const topLevelItem = findTopLevelMenu(authStore.menuRoutes, newValue);
  if (topLevelItem) {
    targetNavigation(topLevelItem);
  }
})

onMounted(() => {
  initializeActiveMenu()
});

const targetNavigation = (item: RouteMenu, index?: number, type?: string) => {
  if (type === 'manual') {
    tabsStore.manualClose = true
  }
  storeNavigation(item)
  setActiveNavigation(item)
}

/**
 * 初始化选中菜单项
 */
const initializeActiveMenu = () => {
  const storedData = getStoredNavigation()
  if (storedData?.id) {
    setActiveNavigation(storedData)
  } else if (menuRoutes.value.length > 0) {
    // 默认选中第一个菜单项
    setActiveNavigation(menuRoutes.value[0])
  }
}

/**
 * 从本地存储获取导航信息
 * @returns 菜单项数据或null
 */
const getStoredNavigation = (): RouteMenu | null => {
  try {
    const data = localStorage.getItem('tagNaveListJavaMer')
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error(' 本地存储读取失败:', error)
    return null
  }
}

/**
 * 存储导航信息到本地存储
 * @param item - 菜单项数据
 */
const storeNavigation = (item: RouteMenu) => {
  try {
    localStorage.setItem("tagNaveListJavaMer", JSON.stringify(item));
  } catch (error) {
    console.error("本地存储写入失败:", error);
  }
}

/**
 * 设置当前激活的导航项
 * @param item - 菜单项数据
 */
const setActiveNavigation = (item: RouteMenu) => {
  activeId.value = item.id
  subNavigation.value = item
}

/**
 * 查找顶级菜单项
 * @param items - 菜单项数组
 * @param path - 要查找的路径
 * @returns 顶级菜单项或null
 */
const findTopLevelMenu = (items: RouteMenu[], path: string): RouteMenu | null => {
  for (const item of items) {
    if (item.path === path) return item;
    if (item.children?.length) {
      const found = findTopLevelMenu(item.children, path);
      if (found) return item;
    }
  }
  return null;
};
defineOptions({ name: 'LayoutAsideNav' })
</script>

<style scoped>
.menu-container {
  @apply flex items-center justify-center h-[50px];
  transition: .3s ease-in-out;
  display: flex;
  min-width: 80px;
}

/* Vue过渡类 */
.slide-enter-active,
.slide-leave-active {
  transition: width 0.2s ease;
  width: 160px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  width: 0;
  transition: width 0.2s ease;
}
</style>
