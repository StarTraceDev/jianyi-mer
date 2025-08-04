/*
 * @Description: 当前页面描述
 * @Author: StarTraceDev
 * @Date: 2025-08-01 17:37:14
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-01 17:37:18
 */
import { defineAsyncComponent, type Component } from 'vue'

// 使用vite的glob导入功能
const modules = import.meta.glob('../views/**/*.vue')

export const dynamicRoutes: Record<string, Component> = {
  '/home': defineAsyncComponent(() => import('@/views/Home/index.vue')),
  '/home/backgroundawait': modules['../views/BackgroundAwait/index.vue'],
  '/home/datastatistics': modules['../views/DataStatistics/index.vue']
}
