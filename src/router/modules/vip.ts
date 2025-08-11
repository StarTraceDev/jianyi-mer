/*
 * @Description: 会员
 * @Author: StarTraceDev
 * @Date: 2025-08-11 09:11:45
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-11 09:14:35
 */
import type { Component } from 'vue'

export const vipRoutes: Record<string, Component> = {
  '/vip/register': () => import('@/views/vip/register/index.vue'),
  '/vip/gridmanagement': () => import('@/views/vip/gridmanagement/index.vue'),
}
