/*
 * @Description: token、动态路由存储
 * @Author: StarTraceDev
 * @Date: 2025-08-01 13:27:42
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-04 22:09:06
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import Cookies from 'js-cookie'
import { dynamicRoutes } from '@/router/dynamicRoutes'
import type { AppRouteRecordRaw, RouteMenu } from '@/types/routers'
import { routesApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(Cookies.get('token') || null)
  const menuRoutes = ref<RouteMenu[]>([])

  // 登录成功后调用
  const loginSuccess = (tkn: string) => {
    token.value = tkn
    // 存储到Cookie (有效期7天)
    Cookies.set('token', tkn, { expires: 7 })
  }

  // 获取路由数据并转换
  const fetchRoutes = async () => {
    const res = await routesApi.getRoutes()
    const data = res.data as RouteMenu[]
    menuRoutes.value = data
    localStorage.setItem("tagNaveListJavaMer", JSON.stringify(data[0]) as string);
    return generateRoutes(res.data as RouteMenu[])
  }

  // 转换路由数据结构
  const generateRoutes = (menus: RouteMenu[]): AppRouteRecordRaw[] => {
    return menus.map(menu => {
      const route: AppRouteRecordRaw = {
        path: menu.path,
        name: menu.path.replace(/\//g, '-').substring(1) || 'home', // 生成唯一name
        component: dynamicRoutes[menu.path] || null,
        meta: {
          title: menu.title,
          icon: menu.icon
        },
        children: [],
        redirect: ''
      }

      if (menu.children && menu.children.length) {
        route.children = generateRoutes(menu.children)

        // 添加父路由重定向到第一个子路由
        if (route.children.length > 0) {
          route.redirect = route.children[0].path
        }
      }

      return route
    })
  }

  // 退出登录
  const logout = () => {
    token.value = null
    Cookies.remove('token')
  }

  return {
    token,
    menuRoutes,
    loginSuccess,
    fetchRoutes,
    logout
  }
})
