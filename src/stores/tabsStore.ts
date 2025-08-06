/*
 * @Description: Tabs导航标签 存储
 * @Author: StarTraceDev
 * @Date: 2025-08-06 13:22:29
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-06 15:44:46
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTabsStore = defineStore('tabs', () => {
  const tabsList = ref<Array<{ path: string; title: string }>>([])
  const activeTab = ref<string>('') // 当前激活的标签路径

  const addTabData = (tab: { path: string; title: string }) => {
    const hasTab = tabsList.value.some((item) => item.path === tab.path)
    if (hasTab) return
    tabsList.value.push(tab)
    activeTab.value = tab.path
  }

  const removeTabData = (path: string) => {
    tabsList.value = tabsList.value.filter((item) => item.path !== path)
    activeTab.value = tabsList.value[tabsList.value.length - 1].path
  }
  return { tabsList, activeTab, addTabData, removeTabData }
}, {
  persist: true
})
