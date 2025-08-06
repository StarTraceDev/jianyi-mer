/*
 * @Description: 动态路由
 * @Author: StarTraceDev
 * @Date: 2025-08-01 17:37:14
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-06 10:22:24
 */
import type { Component } from 'vue'
import { orderRoutes } from './modules/order'
import { operationRoutes } from './modules/operation'

export const dynamicRoutes: Record<string, Component> = {
  '/home/backgroundawait': () => import('@/views/home/BackgroundAwait/index.vue'),
  '/home/datastatistics': () => import('@/views/home/DataStatistics/index.vue'),
  ...orderRoutes,
  ...operationRoutes
}


/**
 * /order/orderFresh/appraiseList
 * /order/orderFresh/After-sales
 * /order/orderFresh/orderList
 */
