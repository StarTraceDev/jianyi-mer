/*
 * @Description: 动态路由
 * @Author: StarTraceDev
 * @Date: 2025-08-01 17:37:14
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-04 21:40:06
 */
import { defineAsyncComponent, type Component } from 'vue'

export const dynamicRoutes: Record<string, Component> = {
  'home': defineAsyncComponent(() => import('../layout/index.vue')),
  '/home/backgroundawait': defineAsyncComponent(() => import('../views/Home/BackgroundAwait/index.vue')),
  '/home/datastatistics': defineAsyncComponent(() => import('../views/Home/DataStatistics/index.vue')),
}
