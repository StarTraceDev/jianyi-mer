/*
 * @Description: 路由类型
 * @Author: StarTraceDev
 * @Date: 2025-08-01 14:05:42
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-04 10:16:31
 */

import type { Component } from "vue"

// 路由菜单项类型
export interface RouteMenu {
  id: number
  pid: number
  title: string
  icon: string
  perms: string
  path: string
  menuType: 'M' | 'C' // M:目录 C:菜单
  sort: number
  children: RouteMenu[]
}

// 路由配置类型
export interface AppRouteRecordRaw {
  redirect: string
  path: string
  name?: string
  component?: Component
  meta?: {
    title: string
    icon?: string
    requiresAuth?: boolean
  }
  children?: AppRouteRecordRaw[]
}
