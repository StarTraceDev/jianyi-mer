/*
 * @Description: cookie操作
 * @Author: StarTraceDev
 * @Date: 2025-08-01 15:15:31
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-01 15:19:06
 */
import Cookies from 'js-cookie'

// Token键名
const TOKEN_KEY = 'auth_token'

// 获取Token
export function getToken(): string | null {
  return Cookies.get(TOKEN_KEY) || null
}

// 设置Token (有效期7天)
export function setToken(token: string) {
  Cookies.set(TOKEN_KEY, token, { expires: 7 })
}

// 移除Token
export function removeToken() {
  Cookies.remove(TOKEN_KEY)
}
