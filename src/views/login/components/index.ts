/*
 * @Description: 登录页配置项
 * @Author: StarTraceDev
 * @Date: 2025-06-04 16:37:29
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-01 15:44:47
 */

// 登录页背景
export interface BackdropImg {
  backgroundImage: string
  leftLogo: string
  loginLogo: string
  siteName: string
}

// 登录表单
export interface RuleForm {
  account: string
  pwd: string
}

// 登录响应类型
export interface LoginResponse {
  code: number
  data: {
    realName: string
    isSms: boolean
    leftTopLogo: string
    leftSquareLogo: string
    merSiteUrl?: unknown
    token: string
  };
  message?: unknown
}
