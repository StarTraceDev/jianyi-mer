<!--
 * @Description: 左侧主菜单
 * @Author: StarTraceDev
 * @Date: 2025-08-04 11:26:10
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-09-01 16:01:55
-->
<template>
  <div class="w-[80px] bg-[#282c34] text-white h-screen m-[5px] border-b border-[#ebeef5]">
    <div class="py-[5px] flex justify-center">
      <img :src="userLogo" alt="" class="size-[50px]">
    </div>
    <div class="containers">
      <div class="item" v-for="(item, index) in menuRoutes" :key="index + '-' + item.id"
        :class="{ 'active': activeIndex === index }" :ref="(el: any) => setItemRef(el, index)"
        @click="targetNavigation(item, index, 'manual')">
        <el-icon :class="item.icon">
          <List />
        </el-icon>
        <div class="text-[13px]">{{ item.title }}</div>
      </div>
      <div class="active-indicator" :style="indicatorStyle"></div>
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
import { ref, reactive, onMounted, computed, watch, defineProps } from 'vue'
import type { ComponentPublicInstance } from 'vue'
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

/**
 * 设置菜单项的引用
 * @param el - 元素引用
 * @param index - 元素索引
 */
const itemRefs = ref<HTMLElement[]>([]);
const setItemRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el instanceof HTMLElement) {
    itemRefs.value[index] = el;
  }
};
const activeIndex = ref(0);
const indicatorStyle = reactive({ width: '0px', top: '0px' });
// 计算指示器位置
const updateIndicatorPosition = () => {
  const activeElement = itemRefs.value[activeIndex.value];
  if (activeElement) {
    indicatorStyle.width = `${activeElement.clientWidth}px`;
    indicatorStyle.top = `${activeElement.offsetTop}px`;
  }
};

const selectItem = (index: number) => {
  activeIndex.value = index;
  updateIndicatorPosition();
};

// 监听 activeTab 变化
watch(() => tabsStore.activeTab, (newValue: string) => {
  selectItem(findTopLevelIndex(menuRoutes.value, newValue));
  const topLevelItem = findTopLevelMenu(authStore.menuRoutes, newValue);
  if (topLevelItem) {
    targetNavigation(topLevelItem);
  }
})

/**
 * 查找顶级菜单索引
 * @param menus 菜单数组
 * @param targetPath 目标路径
 * @returns 顶级菜单索引
 */
const findTopLevelIndex = (menus: RouteMenu[], targetPath: string): number => {
  const hasPath = (menu: RouteMenu): boolean =>
    menu.path === targetPath ||
    !!menu.children?.some(child => hasPath(child));
  return menus.findIndex(topMenu => hasPath(topMenu));
};

onMounted(() => {
  initializeActiveMenu()
  updateIndicatorPosition();
});

/**
 * 导航到指定菜单项
 * @param item 菜单项数据
 * @param index 菜单项索引
 * @param type 导航类型（手动或自动）
 */
const targetNavigation = (item: RouteMenu, index?: number, type?: string) => {
  if (type === 'manual') {
    tabsStore.manualClose = true
  }
  if (index !== undefined) {
    selectItem(index)
  }
  storeNavigation(item)
  setActiveNavigation(item)
}

// 初始化选中菜单项
const initializeActiveMenu = () => {
  const storedData = getStoredNavigation()
  selectItem(findTopLevelIndex(menuRoutes.value, storedData?.path ?? ''))
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
.containers {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item {
  @apply flex items-center justify-center h-[50px];
  display: flex;
  min-width: 80px;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: color 0.3s;
}

.item.active {
  color: #ffffff;
  /* animation: logoAnimation .3s ease-in-out; */
}

.active-indicator {
  background: #4073fa;
  position: absolute;
  bottom: 0;
  height: 50px;
  transition: .3s ease-in-out;
  z-index: 0;
}
</style>
