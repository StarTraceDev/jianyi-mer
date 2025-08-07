<!--
 * @Description: 顶部导航
 * @Author: StarTraceDev
 * @Date: 2025-08-05 15:47:10
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-07 17:45:08
-->
<template>
  <div class="flex items-center justify-between h-[50px] border-b border-[#ebeef5]">
    <div class="flex items-center">
      <el-icon :size="18" class="icons" @click="foldCick">
        <component :is="currentIcon" />
      </el-icon>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in breadcrumbTitle" :key="item">{{ item }}</el-breadcrumb-item>
        <!-- :to="{ path: '/' }" -->
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
import { RefreshRight, FullScreen, Fold, Expand } from '@element-plus/icons-vue'
import { useTabsStore } from '@/stores/tabsStore'
import type { RouteMenu } from '@/types/routers'
import { ref, computed, defineEmits } from 'vue'

const tabsStore = useTabsStore()
const isCollapse = ref<boolean>(true)

const currentIcon = computed(() => {
  return isCollapse.value ? Fold : Expand
})

/**
 * @description: 面包屑导航
 * @return {*}
 */
const breadcrumbTitle = computed(() => {
  const activePath = tabsStore.activeTab;
  const menuList: RouteMenu | null = JSON.parse(
    localStorage.getItem('tagNaveListJavaMer') as string
  );
  const result: string[] = [];

  function findPathAndCollectTitles(menu: RouteMenu, pathStack: string[] = []): boolean {
    const currentStack = [...pathStack];

    if ('path' in menu && menu.path === activePath) {
      currentStack.push(menu.title);
      result.push(...currentStack);
      return true;
    }

    if (menu.children && menu.children.length > 0) {
      currentStack.push(menu.title);
      for (const child of menu.children) {
        if (findPathAndCollectTitles(child, currentStack)) {
          return true;
        }
      }
    }
    return false;
  }
  if (menuList) {
    findPathAndCollectTitles(menuList);
  }
  return result;
})

const emit = defineEmits<{ (e: 'foldClick', value: boolean): void }>()
const foldCick = () => {
  emit('foldClick', isCollapse.value)
  isCollapse.value = !isCollapse.value
}

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
