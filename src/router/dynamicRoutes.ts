/*
 * @Description: 动态路由
 * @Author: StarTraceDev
 * @Date: 2025-08-01 17:37:14
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-05 09:00:32
 */
import { defineAsyncComponent, type Component } from 'vue'

export const dynamicRoutes: Record<string, Component> = {
  'home': defineAsyncComponent(() => import('../layout/index.vue')),
  '/home/backgroundawait': () => import('@/views/home/BackgroundAwait/index.vue'),
  '/home/datastatistics': () => import('@/views/home/DataStatistics/index.vue'),
}
