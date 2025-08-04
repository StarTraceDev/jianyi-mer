/* eslint-disable @typescript-eslint/no-unused-expressions */
/*
 * @Description: 路由
 * @Author: StarTraceDev
 * @Date: 2025-07-31 08:52:13
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-04 10:22:31
 */
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { AppRouteRecordRaw } from '@/types/routers'
import { useAuthStore } from '@/stores/authStore'

const staticRoutes: AppRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' },
    redirect: ''
  },
  {
    path: '/',
    redirect: '/home'  // 添加根路径重定向
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes as RouteRecordRaw[]
})

// 动态添加路由
export const addRoutes = (routes: AppRouteRecordRaw[]) => {
  // 先添加404路由的临时引用
  const notFoundRoute = router.getRoutes().find(r => r.path === '/:pathMatch(.*)*')

  // 移除现有动态路由和404路由
  router.getRoutes().forEach(route => {
    if (route.name && route.name !== 'Login' && route.path !== '/') {
      router.removeRoute(route.name)
    }
  })

  // 添加新路由
  routes.forEach(route => {
    if (!router.hasRoute(route.path)) {
      router.addRoute(route as RouteRecordRaw)
    }

    if (route.children) {
      route.children.forEach(child => {
        router.addRoute(route.path, child as RouteRecordRaw)
      })
    }
  })

  // 重新添加404路由确保在最后
  if (!notFoundRoute) {
    router.addRoute({
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/Error/404.vue')
    })
  } else if (!router.hasRoute('NotFound')) {
    router.addRoute(notFoundRoute)
  }
}

// 导航守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isLogin = !!authStore.token

  // 处理根路径重定向
  if (to.path === '/') {
    next(isLogin ? '/home' : '/login')
    return
  }

  // 登录页重定向
  if (to.path === '/login') {
    isLogin ? next('/home') : next()
    return
  }

  // 非登录页认证检查
  if (!isLogin) {
    next(`/login?redirect=${to.fullPath}`)
    return
  }

  // 首次登录加载动态路由
  if (isLogin && authStore.menuRoutes.length === 0) {
    try {
      const routes = await authStore.fetchRoutes()
      addRoutes(routes)

      // 确保路由添加完成后再导航
      next({ ...to, replace: true })
    } catch (error) {
      authStore.logout()
      next(`/login?redirect=${to.path}`)
    }
  } else {
    next()
  }
})

export default router
