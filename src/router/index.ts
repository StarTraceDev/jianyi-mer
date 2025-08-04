/*
 * @Description: 路由
 * @Author: StarTraceDev
 * @Date: 2025-07-31 08:52:13
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-01 17:35:55
 */
// import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/login',
//       name: 'login',
//       // route level code-splitting
//       // this generates a separate chunk (About.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import('../views/login/index.vue'),
//     },
//     {
//       path: '/',
//       name: 'home',
//       component: HomeView,
//     },
//     {
//       path: '/about',
//       name: 'about',
//       // route level code-splitting
//       // this generates a separate chunk (About.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import('../views/AboutView.vue'),
//     },
//   ],
// })

// export default router

// import { createRouter, createWebHistory } from 'vue-router'
// import { useAuthStore } from '@/stores/authStore'
// import { transformRoutes, isTokenExpired } from '@/utils/routers'
// import { routesApi } from '@/api/auth'
// import type { RouteItem } from '@/types/routers'

// const router = createRouter({
//   history: createWebHistory(),
//   routes: [
//     {
//       path: '/login',
//       component: () => import('@/views/login/index.vue'),
//       meta: { requiresAuth: false },
//     },
//     {
//       path: '/:pathMatch(.*)*',
//       component: () => import('@/views/Error/404.vue'),
//     },
//   ],
// })

// // 添加动态路由
// export function addDynamicRoutes(routes: RouteItem[]) {
//   const dynamicRoutes = transformRoutes(routes)
//   dynamicRoutes.forEach((route) => {
//     router.addRoute(route)
//   })

//   // 添加404兜底
//   router.addRoute({
//     path: '/:pathMatch(.*)*',
//     component: () => import('@/views/Error/404.vue'),
//   })
// }

// // 路由守卫
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore()

//   // 不需要认证的页面
//   if (!to.meta.requiresAuth) return next()

//   // 检查Token是否存在
//   if (!authStore.token) {
//     return next({
//       path: '/login',
//       query: { redirect: to.fullPath },
//     })
//   }

//   // 检查Token是否过期
//   if (authStore.token && isTokenExpired(authStore.token)) {
//     authStore.logout()
//     return next('/login')
//   }

//   // 检查动态路由是否已加载
//   if (authStore.dynamicRoutes.length === 0) {
//     // 从API获取动态路由
//     fetchDynamicRoutes()
//       .then((routes) => {
//         authStore.setDynamicRoutes(routes)
//         addDynamicRoutes(routes)
//         next({ ...to, replace: true })
//       })
//       .catch(() => {
//         authStore.logout()
//         next('/login')
//       })
//   } else {
//     next()
//   }
// })

// // 从Api获取路由
// export const fetchDynamicRoutes = async (): Promise<RouteItem[]> => {
//   try {
//     const response = await routesApi.getRoutes()
//     return response.data as RouteItem[];
//   } catch (error) {
//     console.error('获取动态路由失败', error)
//     return []
//   }
// }

// export default router


// import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
// import { useAuthStore } from '@/stores/authStore'
// import { transformRoutes } from '@/utils/routers'
// import { fetchDynamicRoutes } from '@/api/routes' // 从API导入

// // 基础路由
// const constantRoutes: RouteRecordRaw[] = [
//   {
//     path: '/login',
//     name: 'Login',
//     component: () => import('@/views/login/index.vue'),
//     meta: { requiresAuth: false }
//   },
//   {
//     path: '/404',
//     name: 'NotFound',
//     component: () => import('@/views/404.vue'),
//     meta: { requiresAuth: false }
//   }
// ]

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: constantRoutes
// })

// // 添加动态路由的函数
// export const addDynamicRoutes = async () => {
//   const authStore = useAuthStore()

//   // 如果已加载过动态路由，直接返回
//   if (authStore.dynamicRoutes.length > 0) return

//   try {
//     const routes = await fetchDynamicRoutes()
//     authStore.setDynamicRoutes(routes)

//     const dynamicRoutes = transformRoutes(routes)
//     dynamicRoutes.forEach(route => {
//       router.addRoute(route)
//     })

//     // 确保404路由在最后
//     router.addRoute({
//       path: '/:pathMatch(.*)*',
//       redirect: '/404'
//     })

//     return true
//   } catch (error) {
//     console.error('添加动态路由失败', error)
//     return false
//   }
// }

// // 路由守卫
// router.beforeEach(async (to, from, next) => {
//   const authStore = useAuthStore()

//   // 不需要认证的页面
//   if (!to.meta.requiresAuth) return next()

//   // 检查Token是否存在
//   if (!authStore.token) {
//     return next({
//       path: '/login',
//       query: { redirect: to.fullPath }
//     })
//   }

//   // 检查Token是否过期
//   if (isTokenExpired(authStore.token)) {
//     authStore.logout()
//     return next('/login')
//   }

//   // 加载动态路由
//   if (authStore.dynamicRoutes.length === 0) {
//     const success = await addDynamicRoutes()
//     if (success) {
//       next({ ...to, replace: true })
//     } else {
//       authStore.logout()
//       next('/login')
//     }
//   } else {
//     next()
//   }
// })

// // Token过期检查
// function isTokenExpired(token: string): boolean {
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]))
//     return payload.exp * 1000 < Date.now()
//   } catch {
//     return true
//   }
// }

// export default router

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { AppRouteRecordRaw } from '@/types/routers'
import { useAuthStore } from '@/stores/authStore'

const staticRoutes: AppRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/Error/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes as RouteRecordRaw[]
})

// 动态添加路由
export const addRoutes = (routes: AppRouteRecordRaw[]) => {
  routes.forEach(route => {
    if (!router.hasRoute(route.path)) {
      router.addRoute(route as RouteRecordRaw)
    }

    // 添加子路由
    if (route.children) {
      route.children.forEach((child: RouteRecordRaw) => {
        if (!router.hasRoute(child.path)) {
          router.addRoute(route.path, child as RouteRecordRaw)
        }
      })
    }
  })
}

// 导航守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isLogin = !!authStore.token

  // 登录页重定向
  if (to.path === '/login') {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
      next({ ...to, replace: true }) // 重新导航
    } catch (error) {
      authStore.logout()
      next(`/login?redirect=${to.path}`)
    }
  } else {
    next()
  }
})

export default router
