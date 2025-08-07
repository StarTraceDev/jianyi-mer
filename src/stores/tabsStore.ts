/*
 * @Description: Tabs导航标签 存储
 * @Author: StarTraceDev
 * @Date: 2025-08-06 13:22:29
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-07 15:03:19
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTabsStore = defineStore('tabs', () => {
  const tabsList = ref<Array<{ path: string; title: string }>>([])
  const activeTab = ref<string>('') // 当前激活的标签路径
  const manualClose = ref<boolean>(false)

  /**
   * 添加标签页
   * @param tab - 要添加的标签页数据
   */
  const addTabData = (tab: { path: string; title: string }) => {
    const hasTab = tabsList.value.some((item) => item.path === tab.path)
    if (hasTab) return
    tabsList.value.push(tab)
    activeTab.value = tab.path
  }
  /**
   * 删除标签页
   * @param path - 要删除的标签页路径
   */
  const removeTabData = (path: string) => {
    tabsList.value = tabsList.value.filter((item) => item.path !== path)
    activeTab.value = tabsList.value[tabsList.value.length - 1].path
  }
  /**
   * 设置当前激活的标签页
   * @param path - 要设置的标签页路径
   */
  const setActiveTab = (path: string) => {
    activeTab.value = path
  }
  return { tabsList, activeTab, manualClose, addTabData, removeTabData, setActiveTab }
}, {
  persist: true
})
