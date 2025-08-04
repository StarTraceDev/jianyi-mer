/*
 * @Description: 当前页面描述
 * @Author: StarTraceDev
 * @Date: 2025-08-01 13:27:42
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-01 17:39:42
 */
// import { defineStore } from 'pinia'
// import { ref } from 'vue'
// import { loginApi } from '@/api/login'
// import type { RouteItem } from '@/types/routers'

// export const useAuthStore = defineStore('auth', () => {
//   // 使用ref创建响应式状态
//   const token = ref<string | null>(null)
//   const userInfo = ref<Record<string, unknown> | null>(null)
//   const dynamicRoutes = ref<RouteItem[]>([])
//   const memberInfo = ref<Record<string, unknown> | null>(null)

//   // 定义actions
//   const setToken = (newToken: string) => {
//     token.value = newToken
//   }

//   const clearToken = () => {
//     token.value = null
//   }

//   const setDynamicRoutes = (routes: RouteItem[]) => {
//     dynamicRoutes.value = routes
//   }

//   const logout = () => {
//     token.value = null
//     userInfo.value = null
//     dynamicRoutes.value = []
//   }

//   const fetchAdminInfo = async () => {
//     try {

//       const response = await loginApi.getAdminInfo()
//       console.log(response);

//       // const response = await axios.get('/api/admin/merchant/getAdminInfoByToken', {
//       //   headers: {
//       //     Authorization: `Bearer ${localStorage.getItem('token')}` // 从本地存储获取 token
//       //   }
//       // })
//       // this.adminInfo = response.data.data // 根据实际响应结构调整
//     } catch (err: unknown) {
//     }
//     // memberInfo.value = newUserInfo
//   }

//   // 返回所有状态和方法
//   return {
//     token,
//     userInfo,
//     memberInfo,
//     dynamicRoutes,
//     setToken,
//     clearToken,
//     setDynamicRoutes,
//     logout,
//     fetchAdminInfo
//   }
// }, {
//   // 持久化配置作为第三个参数
//   persist: {
//     paths: ['token'] // 只持久化token
//   }
// } as never)


import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AppRouteRecordRaw, RouteMenu } from '@/types/routers'
import Cookies from 'js-cookie'
import { dynamicRoutes } from '@/router/dynamicRoutes'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(Cookies.get('token') || null)
  const menuRoutes = ref<RouteMenu[]>([])

  // 登录成功后调用
  const loginSuccess = (tkn: string) => {
    token.value = tkn
    // 存储到Cookie (有效期1天)
    Cookies.set('token', tkn, { expires: 1 })
  }

  // 获取路由数据并转换
  const fetchRoutes = async () => {
    // 模拟API请求
    const res = await mockFetchRoutes()
    menuRoutes.value = res.data

    // 转换路由并返回
    return generateRoutes(res.data)
  }

  // 转换路由数据结构
  const generateRoutes = (menus: RouteMenu[]): AppRouteRecordRaw[] => {
    return menus.map(menu => {
      const route: AppRouteRecordRaw = {
        path: menu.path,
        component: dynamicRoutes[menu.path] || null,
        meta: {
          title: menu.title,
          icon: menu.icon
        }
      }

      if (menu.children && menu.children.length) {
        route.children = generateRoutes(menu.children)
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

// 模拟API请求
const mockFetchRoutes = (): Promise<{ data: RouteMenu[] }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: [{
          id: 1075,
          pid: 0,
          title: "首页",
          icon: "s-home",
          perms: "",
          path: "/home",
          menuType: "M",
          sort: 9997,
          children: [
            {
              id: 1076,
              pid: 1075,
              title: "后台待办",
              icon: "",
              perms: "",
              path: "/home/backgroundawait",
              menuType: "C",
              sort: 1,
              children: []
            },
            {
              id: 1077,
              pid: 1075,
              title: "数据统计",
              icon: "",
              perms: "",
              path: "/home/datastatistics",
              menuType: "C",
              sort: 1,
              children: []
            }
          ]
        }]
      })
    }, 500)
  })
}
