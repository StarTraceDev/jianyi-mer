<!--
 * @Description: 标签导航
 * @Author: StarTraceDev
 * @Date: 2025-08-05 15:57:34
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-09-02 08:44:55
-->
<template>
  <div class="flex h-[34px] items-center">
    <el-icon>
      <ArrowLeft />
    </el-icon>
    <el-scrollbar :noresize="true" :always="true" class="h-full w-[95%]">
      <div class="flex gap-2 h-full px-[10px]" @mousewheel.prevent>
        <el-tag v-for="tag in tabsList" :key="tag.path" :closable="isClosable(tag.path)" :disable-transitions="true"
          :checked="true" @close="handleClose(tag)" @click="tabsStore.setActiveTab(tag.path)" :class="{
            'active-tag': tabsStore.activeTab === tag.path
          }" class="public-tag">
          {{ tag.title }}
        </el-tag>
      </div>
    </el-scrollbar>

    <el-icon>
      <ArrowRight />
    </el-icon>
    <el-dropdown>
      <el-icon color="#4073FA" class="el-icon--right">
        <Menu />
      </el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item in menuOptions" :key="item.action" @click="handleMenuClick(item.action)">
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang='ts'>
import { Menu, Close, ArrowLeft, ArrowRight, CircleClose, RefreshRight, FolderDelete } from '@element-plus/icons-vue'
import { useTabsStore } from '@/stores/tabsStore'
import { computed, type Component } from 'vue'

const tabsStore = useTabsStore()

// 标签列表
const tabsList = computed(() => {
  return tabsStore.tabsList as Array<{ path: string; title: string }>
})

// 关闭标签
const handleClose = (tag: { path: string; title: string }) => {
  tabsStore.removeTabData(tag.path)
}

// 判断是否可关闭
const isClosable = (path: string): boolean => {
  return path !== '/home/backgroundawait'
}

interface MenuOptions {
  icon: Component
  label: string
  action: Action
}
type Action = 'refresh' | 'close' | 'closeOthers' | 'closeAll'

// 菜单
const menuOptions: MenuOptions[] = [
  { icon: RefreshRight, label: '刷新', action: 'refresh' },
  { icon: Close, label: '关闭', action: 'close' },
  { icon: CircleClose, label: '关闭其他', action: 'closeOthers' },
  { icon: FolderDelete, label: '全部关闭', action: 'closeAll' },
]

/**
 * 菜单点击
 * @param action 操作
 */
const handleMenuClick = (action: Action) => {
  switch (action) {
    case 'refresh':
      console.log('刷新')
      break
    case 'close':
      tabsStore.removeTabData(tabsStore.activeTab)
      break
    case 'closeOthers':
      console.log('关闭其他')
      // tabsStore.activeTab
      tabsStore.closeOtherTabs()
      break
    case 'closeAll':
      tabsStore.closeAllTabs()
      break
  }
}

defineOptions({ name: 'TagNav' })
</script>

<style lang="scss" scoped>
$active-tag-bg: var(--el-color-primary-light-9);
$active-tag-border: var(--el-color-primary);
$active-tag-color: #4073FA;
$mask-size: 18px 30px, 18px 30px, calc(100% - 30px) calc(100% + 17px);
$mask-position: right bottom, left bottom, center top;

@mixin tag-mask {
  -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0ibm9uZSI+CgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxwYXRoIHRyYW5zZm9ybT0icm90YXRlKC0wLjEzMzUwNiA1MC4xMTkyIDUwKSIgaWQ9InN2Z18xIiBkPSJtMTAwLjExOTE5LDEwMGMtNTUuMjI4LDAgLTEwMCwtNDQuNzcyIC0xMDAsLTEwMGwwLDEwMGwxMDAsMHoiIG9wYWNpdHk9InVuZGVmaW5lZCIgc3Ryb2tlPSJudWxsIiBmaWxsPSIjRjhFQUU3Ii8+CiAgPHBhdGggZD0ibS0wLjYzNzY2LDcuMzEyMjhjMC4xMTkxOSwwIDAuMjE3MzcsMC4wNTc5NiAwLjQ3Njc2LDAuMTE5MTljMC4yMzIsMC4wNTQ3NyAwLjI3MzI5LDAuMDM0OTEgMC4zNTc1NywwLjExOTE5YzAuMDg0MjgsMC4wODQyOCAwLjM1NzU3LDAgMC40NzY3NiwwbDAuMTE5MTksMGwwLjIzODM4LDAiIGlkPSJzdmdfMiIgc3Ryb2tlPSJudWxsIiBmaWxsPSJub25lIi8+CiAgPHBhdGggZD0ibTI4LjkyMTM0LDY5LjA1MjQ0YzAsMC4xMTkxOSAwLDAuMjM4MzggMCwwLjM1NzU3bDAsMC4xMTkxOWwwLDAuMTE5MTkiIGlkPSJzdmdfMyIgc3Ryb2tlPSJudWxsIiBmaWxsPSJub25lIi8+CiAgPHJlY3QgaWQ9InN2Z180IiBoZWlnaHQ9IjAiIHdpZHRoPSIxLjMxMTA4IiB5PSI2LjgzNTUyIiB4PSItMC4wNDE3MSIgc3Ryb2tlPSJudWxsIiBmaWxsPSJub25lIi8+CiAgPHJlY3QgaWQ9InN2Z181IiBoZWlnaHQ9IjEuNzg3ODQiIHdpZHRoPSIwLjExOTE5IiB5PSI2OC40NTY1IiB4PSIyOC45MjEzNCIgc3Ryb2tlPSJudWxsIiBmaWxsPSJub25lIi8+CiAgPHJlY3QgaWQ9InN2Z182IiBoZWlnaHQ9IjQuODg2NzciIHdpZHRoPSIxOS4wNzAzMiIgeT0iNTEuMjkzMjEiIHg9IjM2LjY2ODY2IiBzdHJva2U9Im51bGwiIGZpbGw9Im5vbmUiLz4KIDwvZz4KPC9zdmc+'),
    url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0ibm9uZSI+CiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPHBhdGggdHJhbnNmb3JtPSJyb3RhdGUoLTg5Ljc2MjQgNy4zMzAxNCA1NS4xMjUyKSIgc3Ryb2tlPSJudWxsIiBpZD0ic3ZnXzEiIGZpbGw9IiNGOEVBRTciIGQ9Im02Mi41NzQ0OSwxMTcuNTIwODZjLTU1LjIyOCwwIC0xMDAsLTQ0Ljc3MiAtMTAwLC0xMDBsMCwxMDBsMTAwLDB6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgogIDxwYXRoIGQ9Im0tMC42Mzc2Niw3LjMxMjI4YzAuMTE5MTksMCAwLjIxNzM3LDAuMDU3OTYgMC40NzY3NiwwLjExOTE5YzAuMjMyLDAuMDU0NzcgMC4yNzMyOSwwLjAzNDkxIDAuMzU3NTcsMC4xMTkxOWMwLjA4NDI4LDAuMDg0MjggMC4zNTc1NywwIDAuNDc2NzYsMGwwLjExOTE5LDBsMC4yMzgzOCwwIiBpZD0ic3ZnXzIiIHN0cm9rZT0ibnVsbCIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Im0yOC45MjEzNCw2OS4wNTI0NGMwLDAuMTE5MTkgMCwwLjIzODM4IDAsMC4zNTc1N2wwLDAuMTE5MTlsMCwwLjExOTE5IiBpZD0ic3ZnXzMiIHN0cm9rZT0ibnVsbCIgZmlsbD0ibm9uZSIvPgogIDxyZWN0IGlkPSJzdmdfNCIgaGVpZ2h0PSIwIiB3aWR0aD0iMS4zMTEwOCIgeT0iNi44MzU1MiIgeD0iLTAuMDQxNzEiIHN0cm9rZT0ibnVsbCIgZmlsbD0ibm9uZSIvPgogIDxyZWN0IGlkPSJzdmdfNSIgaGVpZ2h0PSIxLjc4Nzg0IiB3aWR0aD0iMC4xMTkxOSIgeT0iNjguNDU2NSIgeD0iMjguOTIxMzQiIHN0cm9rZT0ibnVsbCIgZmlsbD0ibm9uZSIvPgogIDxyZWN0IGlkPSJzdmdfNiIgaGVpZ2h0PSI0Ljg4Njc3IiB3aWR0aD0iMTkuMDcwMzIiIHk9IjUxLjI5MzIxIiB4PSIzNi42Njg2NiIgc3Ryb2tlPSJudWxsIiBmaWxsPSJub25lIi8+CiA8L2c+Cjwvc3ZnPg=='),
    url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><rect rx='8' width='100%' height='100%' fill='%23F8EAE7'/></svg>");
  -webkit-mask-size: $mask-size;
  -webkit-mask-position: $mask-position;
  -webkit-mask-repeat: no-repeat;
  padding: 0 30px;
  background: $active-tag-bg;
  border: 1px solid $active-tag-border;
  color: $active-tag-color !important;
  transform: scale(1.05);
  transition: all 0.3s ease;
  z-index: 999;
}


.public-tag {
  position: relative;
  // bottom: -5px;
  height: 30px;
  padding: 0 30px;
  border-width: 15px 27px 15px;
  border-style: solid;
  border-color: transparent;
  margin: 5px -15px 0 -15px;
  --el-tag-bg-color: #ffffff !important;
  border: none !important;
  color: black;
}

.active-tag {
  @include tag-mask;
}

:deep(.el-tag:hover) {
  @include tag-mask;
}

:deep(.el-tag__close) {
  color: black !important;
}

:deep(.el-tag .el-tag__close:hover) {
  background-color: transparent !important;
  color: inherit !important;
}

:deep(.el-scrollbar__bar.is-horizontal) {
  height: 0 !important;
}

:deep(.el-scrollbar__bar.is-vertical) {
  width: 0 !important;
}

:deep(.el-scrollbar__wrap) {
  overflow-x: hidden !important;
}
</style>
