/*
 * @Description: 网格
 * @Author: StarTraceDev
 * @Date: 2025-08-11 09:06:54
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-11 09:09:59
 */
import type { Component } from 'vue'

export const gridRoutes: Record<string, Component> = {
  '/grid/apply': () => import('@/views/grid/apply/index.vue'),
  '/grid/management': () => import('@/views/grid/management/index.vue'),
}
