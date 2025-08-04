/*
 * @Description: 当前页面描述
 * @Author: StarTraceDev
 * @Date: 2025-08-01 14:08:13
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-01 17:12:30
 */
// import type { RouteItem, DynamicRoute } from '@/types/routers'

// // 转换后端路由为Vue路由格式
// export function transformRoutes(routes: RouteItem[]): DynamicRoute[] {
//   return routes.map(route => {
//     const transformed: DynamicRoute = {
//       path: route.path,
//       name: route.path.replace(/\//g, '-').substring(1),
//       component: () => resolveComponent(route.menuType, route.path),
//       meta: {
//         title: route.title,
//         icon: route.icon
//       }
//     }

//     if (route.children && route.children.length > 0) {
//       transformed.children = transformRoutes(route.children)
//     }
//     return transformed
//   })
// }

// // 解析组件路径
// function resolveComponent(menuType: string, path: string) {
//   if (menuType === 'M') {
//     return import(`@/views/${path}/index.vue`)
//   }

//   // 处理路径转换 (示例：/home/backgroundawait -> home/backgroundawait)
//   const componentPath = path.startsWith('/')
//     ? path.slice(1).replace(/\//g, '/')
//     : path.replace(/\//g, '/')

//   return import(`@/views/${componentPath}/index.vue`)
// }

// /**
//  * 检查JWT令牌是否过期
//  * @param token - JWT令牌
//  * @returns true 表示令牌过期或无效，否则为 false
//  */
// export function isTokenExpired(token: string): boolean {
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]))
//     return payload.exp * 1000 < Date.now()
//   } catch {
//     return true
//   }
// }
