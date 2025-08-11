/*
 * @Description: 动态路由
 * @Author: StarTraceDev
 * @Date: 2025-08-01 17:37:14
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-11 09:23:51
 */
import type { Component } from 'vue'
import { orderRoutes } from './modules/order'
import { serviceRoutes } from './modules/service'
import { vipRoutes } from './modules/vip'
import { gridRoutes } from './modules/grid'
import { operationRoutes } from './modules/operation'

export const dynamicRoutes: Record<string, Component> = {
  '/home/backgroundawait': () => import('@/views/home/BackgroundAwait/index.vue'),
  '/home/datastatistics': () => import('@/views/home/DataStatistics/index.vue'),
  // 订单
  ...orderRoutes,
  // 客服
  ...serviceRoutes,
  // 会员
  ...vipRoutes,
  // 网格
  ...gridRoutes,
  ...operationRoutes
}
