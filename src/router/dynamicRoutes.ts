/*
 * @Description: 动态路由
 * @Author: StarTraceDev
 * @Date: 2025-08-01 17:37:14
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-09-01 15:14:06
 */
import type { Component } from 'vue'
import { homeRoutes } from './modules/home'
import { orderRoutes } from './modules/order'
import { serviceRoutes } from './modules/service'
import { vipRoutes } from './modules/vip'
import { gridRoutes } from './modules/grid'
import { operationRoutes } from './modules/operation'

export const dynamicRoutes: Record<string, Component> = {
  // 首页
  ...homeRoutes,
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
