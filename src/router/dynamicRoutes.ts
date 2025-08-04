/*
 * @Description: 动态路由
 * @Author: StarTraceDev
 * @Date: 2025-08-01 17:37:14
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-04 10:18:20
 */
import { defineAsyncComponent, type Component } from 'vue'

const modules = import.meta.glob('../views/**/*.vue')

export const dynamicRoutes: Record<string, Component> = {
  '/home': defineAsyncComponent(() => import('../views/home/index.vue')),
  '/home/backgroundawait': defineAsyncComponent(() => import('../views/home/BackgroundAwait/index.vue')),
  '/home/datastatistics': defineAsyncComponent(() => import('../views/home/DataStatistics/index.vue')),
}
