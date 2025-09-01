/* eslint-disable @typescript-eslint/no-unused-expressions */
/*
 * @Description: 路由
 * @Author: StarTraceDev
 * @Date: 2025-07-31 08:52:13
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-09-01 15:13:15
 */
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, RouteRecordName } from 'vue-router'
import type { AppRouteRecordRaw } from '@/types/routers'
import { useAuthStore } from '@/stores/authStore'
import Layout from '@/layout/index.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 静态路由
const staticRoutes: AppRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' },
    redirect: '',
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'LayoutRoot',
    children: [], // 动态路由添加
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes as RouteRecordRaw[],
})

// 动态添加路由到 Layout 的 children 下
export const addRoutes = (routes: AppRouteRecordRaw[]) => {
  const layoutRouteName: RouteRecordName = 'LayoutRoot'
  // 临时保存 404 路由
  const notFoundRoute = router.getRoutes().find((r) => r.path === '/:pathMatch(.*)*')

  // 移除旧的动态路由（除了登录页和 Layout）
  router.getRoutes().forEach((route) => {
    if (
      route.name &&
      route.name !== 'Login' &&
      route.name !== layoutRouteName &&
      !route.path.startsWith('/login')
    ) {
      router.removeRoute(route.name)
    }
  })

  // 将新路由添加到 Layout 的 children 中
  routes.forEach((route) => {
    if (!router.hasRoute(route.name!)) {
      router.addRoute(layoutRouteName, route as RouteRecordRaw)
    }

    // 如果有子路由，也添加进去
    if (route.children?.length) {
      route.children.forEach((child) => {
        if (!router.hasRoute(child.name!)) {
          router.addRoute(route.name!, child as RouteRecordRaw)
        }
      })
    }
  })

  // 确保 404 路由始终在最后
  if (!notFoundRoute) {
    router.addRoute({
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/Error/404.vue'),
    })
  } else if (!router.hasRoute('NotFound')) {
    router.addRoute(notFoundRoute)
  }
}

NProgress.configure({ showSpinner: false })
// 导航守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isLogin = !!authStore.token
  NProgress.start()

  // 处理根路径
  if (to.path === '/') {
    next(isLogin ? '/home' : '/login')
    return
  }

  // 登录页判断
  if (to.path === '/login') {
    isLogin ? next('/home') : next()
    return
  }

  // 未登录跳转登录页
  if (!isLogin) {
    next(`/login?redirect=${to.fullPath}`)
    return
  }

  // 首次登录加载动态路由
  if (isLogin && authStore.menuRoutes.length === 0) {
    try {
      const routes = await authStore.fetchRoutes()
      addRoutes(routes)

      // 使用 replace: true 避免重复历史记录
      next({ ...to, replace: true })
    } catch (error) {
      authStore.logout()
      next(`/login?redirect=${to.path}`)
    }
  } else {
    next()
  }
})
// 导航后关闭进度条
router.afterEach(() => {
  NProgress.done()
})

export default router
