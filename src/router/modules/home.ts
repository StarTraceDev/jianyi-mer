/*
 * @Description: 首页
 * @Author: StarTraceDev
 * @Date: 2025-09-01 13:38:22
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-09-01 15:13:42
 */
import type { Component } from 'vue'

export const homeRoutes: Record<string, Component> = {
  '/home/backgroundawait': () => import('@/views/home/BackgroundAwait/index.vue'),
  '/home/datastatistics': () => import('@/views/home/DataStatistics/index.vue'),
}
