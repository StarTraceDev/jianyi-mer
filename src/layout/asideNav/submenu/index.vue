<!--
 * @Description: 当前页面描述
 * @Author: StarTraceDev
 * @Date: 2025-08-04 13:16:56
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-04 23:32:46
-->
<template>
  <div>
    <div class="h-[50px] flex items-center justify-around fw-500 border-b border-r border-[#ebeef5]">{{
      subNavigation.title }}
    </div>
    <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" router="true" mode="vertical"
      @select="handleMenuSelect">
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
import type { RouteMenu } from '@/types/routers'

const props = defineProps({
  subNavigation: {
    type: Object as () => RouteMenu,
    default: () => ({})
  }
})

// 当前激活的菜单路径
const activeMenu = ref<string>('');
// 当前激活的菜单项
const activeItem = ref<RouteMenu | null>(null);

// 处理菜单选择
const handleMenuSelect = (path: string) => {
  console.log('handleMenuSelect', path);

  activeMenu.value = path;
  for (const firstLevel of props.subNavigation.children || []) {
    if (firstLevel.path === path) {
      activeItem.value = firstLevel;
      return;
    }
    for (const secondLevel of firstLevel.children || []) {
      if (secondLevel.path === path) {
        activeItem.value = secondLevel;
        return;
      }
    }
  }
};

watch(() => props.subNavigation, (newValue) => {
  console.log(newValue.children[0].path);
  // handleMenuSelect(newValue.children[0].path);
  activeMenu.value = getFirstLeafPath(newValue)
});

// 获取第一个叶子节点的路径
const getFirstLeafPath = (item: RouteMenu) => {
  if (item.children && item.children.length > 0) {
    return getFirstLeafPath(item.children[0]);
  }
  return item.path;
}

defineOptions({ name: 'LayoutAsideNavSubmenu' })
</script>

<style lang='scss' scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  height: calc(100vh - 50px);
}

// 菜单选中背景色
.el-menu-item.is-active {
  background-color: #E5EEFF !important;
}
</style>
