<!--
 * @Description: 左侧子菜单
 * @Author: StarTraceDev
 * @Date: 2025-08-04 13:16:56
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-09-02 08:44:16
-->
<template>
  <div class="sub-menu">
    <div class="h-[50px] flex items-center justify-around font-bold border-b border-r border-[#ebeef5]">{{
      subNavigation.title }}
    </div>
    <el-menu :default-active="activeMenu" :unique-opened="true" :collapse="props.collapseNav" :router="true"
      mode="vertical" @select="handleMenuSelect" class="el-menu-vertical-demo">
      <!-- 直接从第一级的children开始循环 -->
      <template v-for="firstLevel in props.subNavigation.children" :key="firstLevel.id">
        <!-- 有二级菜单的情况 -->
        <el-sub-menu v-if="firstLevel.children && firstLevel.children.length > 0" :index="firstLevel.path">
          <template #title>
            <span class="inline-block pl-5">{{ firstLevel.title }}</span>
          </template>

          <!-- 循环二级菜单 -->
          <el-menu-item v-for="secondLevel in firstLevel.children" :key="secondLevel.id" :index="secondLevel.path">
            <span class="inline-block pl-5">{{ secondLevel.title }}</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 没有二级菜单的情况 -->
        <el-menu-item v-else :index="firstLevel.path">
          <span class="inline-block pl-5">{{ firstLevel.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang='ts'>
import { ref, defineProps, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTabsStore } from '@/stores/tabsStore'
import type { RouteMenu } from '@/types/routers'

const tabsStore = useTabsStore()

const props = defineProps({
  subNavigation: {
    type: Object as () => RouteMenu,
    default: () => ({})
  },
  collapseNav: {
    type: Boolean,
    default: false
  }
})

// 当前激活的菜单路径
const activeMenu = ref<string>('');
// 当前激活的菜单项
const activeItem = ref<RouteMenu | null>(null);

/**
 * 设置当前激活的菜单项
 * @param path - 菜单项路径
 */
const handleMenuSelect = (path: string) => {
  activeMenu.value = path;
  tabsStore.setActiveTab(path)
  for (const firstLevel of props.subNavigation.children || []) {
    if (firstLevel.path === path) {
      const { path, title } = firstLevel;
      tabsStore.addTabData({ path, title });
      activeItem.value = firstLevel;
      return;
    }
    for (const secondLevel of firstLevel.children || []) {
      if (secondLevel.path === path) {
        const { path, title } = secondLevel;
        tabsStore.addTabData({ path, title });
        activeItem.value = secondLevel;
        return;
      }
    }
  }
};

const router = useRouter();
/**
 * 监听子导航变化,添加新的标签页
 * @param newValue - 新的子导航数据
 */
watch(() => props.subNavigation, (newValue) => {
  const { path, title } = getFirstLeafPath(newValue) as { path: string; title: string };
  tabsStore.addTabData({ path, title });
  activeMenu.value = path;
  router.push(path);
});

/**
 * 监听当前激活的标签页,跳转到对应的路由
 * @param newValue - 新的激活的标签页路径
 */
watch(() => tabsStore.activeTab, (newValue) => {
  activeMenu.value = newValue;
  router.push(newValue);
})

/**
 * 获取第一个叶子节点的路径和标题
 * @param item - 菜单项数据
 * @returns 第一个叶子节点路径和标题
 */
const getFirstLeafPath = (item: RouteMenu) => {
  const { activeTab, tabsList, manualClose, setActiveTab } = tabsStore
  if (activeTab && !manualClose) {
    tabsStore.manualClose = false
    return tabsList.find(item => item.path === activeTab)
  }
  if (item.children && item.children.length > 0) {
    setTimeout(() => {
      tabsStore.manualClose = false
    }, 100);
    return getFirstLeafPath(item.children[0]);
  }
  setActiveTab(item.path)
  return { path: item.path, title: item.title }
}
defineOptions({ name: 'LayoutAsideNavSubmenu' })
</script>

<style lang='scss' scoped>
.sub-menu {
  transition: width 0.3s ease;
  box-shadow: 1px 1px 4px rgba(0, 21, 41, 0.08);
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu-item) {
  height: 50px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  height: calc(100vh - 50px);
}

// 菜单选中背景色
.el-menu-item.is-active {
  background-color: #E5EEFF !important;
}
</style>
