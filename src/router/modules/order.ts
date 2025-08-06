/*
 * @Description: 订单
 * @Author: StarTraceDev
 * @Date: 2025-08-06 09:38:19
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-06 10:01:00
 */
import type { Component } from 'vue'

export const orderRoutes: Record<string, Component> = {
  '/order/middle/all': () => import('@/views/order/middle/all/index.vue'),
  '/order/middle/aftersale': () => import('@/views/order/middle/aftersale/index.vue'),
  '/order/middle/evaluate': () => import('@/views/order/middle/evaluate/index.vue'),
  '/order/orderFresh/orderList': () => import('@/views/order/orderFresh/orderList/index.vue'),
  '/order/orderFresh/appraiseList': () => import('@/views/order/orderFresh/appraiseList/index.vue'),
  '/order/orderFresh/After-sales': () => import('@/views/order/orderFresh/After-sales/index.vue')
}
