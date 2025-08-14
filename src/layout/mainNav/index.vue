<!--
 * @Description: 顶部导航
 * @Author: StarTraceDev
 * @Date: 2025-08-05 15:47:10
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-14 09:02:35
-->
<template>
  <div class="flex items-center justify-between h-[50px] border-b border-[#ebeef5]">
    <div class="flex items-center">
      <el-icon :size="18" class="icons" @click="foldCick">
        <component :is="currentIcon" />
      </el-icon>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in breadcrumbTitle" :key="item">{{ item }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="flex items-center">
      <div class="features-icon">
        <el-icon>
          <RefreshRight />
        </el-icon>
      </div>
      <div class="features-icon" @click="toggleFullScreen">
        <el-icon>
          <component :is="fullScreenIcon" />
        </el-icon>
      </div>
      <div class="platform">
        <div class="bg-[#4073FA] py-[3px] px-[8px] text-white rounded-[10px] text-[12px]">商城</div>
      </div>
      <el-dropdown :hide-on-click="false">
        <span class="el-dropdown-link">
          {{ shopTitle }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>账户管理</el-dropdown-item>
            <el-dropdown-item>修改密码</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <TabNav />
</template>

<script setup lang='ts'>
import screenfull from 'screenfull'
import TabNav from '../tagNav/index.vue';
import { RefreshRight, FullScreen, Fold, Expand, ArrowDown, Crop } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/authStore'
import { useTabsStore } from '@/stores/tabsStore'
import type { RouteMenu } from '@/types/routers'
import type { userStateInfo } from '@/types/stores'
import { ref, computed, defineEmits } from 'vue'

const authStore = useAuthStore()
const tabsStore = useTabsStore()
const isCollapse = ref<boolean>(true)
// 导航图标
const currentIcon = computed(() => {
  return isCollapse.value ? Fold : Expand
})
// 商城名称
const shopTitle = computed(() => {
  const { realName } = authStore.userInfo as userStateInfo
  return realName
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

/**
 * 切换全屏
 */
const isFullScreen = ref<boolean>(false)
const fullScreenIcon = computed(() => {
  return isFullScreen.value ? Crop : FullScreen
})
interface CustomScreenfull extends Omit<typeof screenfull, 'isEnabled'> {
  isEnabled: boolean;
}
const customScreenfull = screenfull as CustomScreenfull;
const toggleFullScreen = (): void => {
  if (!customScreenfull.isEnabled) {
    return;
  }
  isFullScreen.value = !isFullScreen.value
  customScreenfull.toggle();
};

/**
 * 退出登录
 */
const handleLogOut = () => {
  authStore.logout()
}

defineOptions({ name: 'MainNav' })
</script>

<style lang='scss' scoped>
.icons {
  margin: 0 15px;
}

.icon {

  &:hover {
    background: rgba(0, 0, 0, 0.04);

    i {
      display: inline-block;
      animation: logoAnimation 0.3s ease-in-out;
    }
  }
}

@mixin nav-mask {
  height: 50px;
  line-height: 50px;
  padding: 0 10px;
  display: inline-block;
}

.features-icon {
  @include nav-mask;

  &:hover {
    background: rgba(0, 0, 0, 0.04);

    el-icon {
      display: inline-block;
      animation: logoAnimation 0.3s ease-in-out;
    }
  }
}

.platform {
  padding: 0 10px;
}



.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.example-showcase .el-dropdown+.el-dropdown {
  margin-left: 15px;
}
</style>
