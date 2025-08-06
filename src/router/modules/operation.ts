/*
 * @Description: 当前页面描述
 * @Author: StarTraceDev
 * @Date: 2025-08-06 10:14:42
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-06 10:39:30
 */
import type { Component } from 'vue'

export const operationRoutes: Record<string, Component> = {
  '/operation/roleManager/adminList': () => import('@/views/operation/roleManager/adminList/index.vue'),



  // '/order/middle/aftersale': () => import('@/views/order/middle/aftersale/index.vue'),
  // '/order/middle/evaluate': () => import('@/views/order/middle/evaluate/index.vue'),
  // '/order/orderFresh/orderList': () => import('@/views/order/orderFresh/orderList/index.vue'),
  // '/order/orderFresh/appraiseList': () => import('@/views/order/orderFresh/appraiseList/index.vue'),
  // '/order/orderFresh/After-sales': () => import('@/views/order/orderFresh/After-sales/index.vue')
}
