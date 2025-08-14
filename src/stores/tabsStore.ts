/*
 * @Description: Tabs导航标签 存储
 * @Author: StarTraceDev
 * @Date: 2025-08-06 13:22:29
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-14 17:52:42
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
  /**
   * 除第一个标签与激活的标签页外关闭所有标签页
   */
  const closeOtherTabs = () => {
    tabsList.value.filter((item) => item.path === activeTab.value || item.path === '/home/backgroundawait')
    manualClose.value = true
  }
  /**
   * 全部关闭标签页
   */
  const closeAllTabs = () => {
    tabsList.value.splice(1, tabsList.value.length - 1)
    activeTab.value = tabsList.value[tabsList.value.length - 1].path
  }
  return { tabsList, activeTab, manualClose, addTabData, removeTabData, setActiveTab, closeAllTabs, closeOtherTabs }
}, {
  persist: true
})
