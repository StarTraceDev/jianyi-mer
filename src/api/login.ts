/*
 * @Description: 登陆Api
 * @Author: StarTraceDev
 * @Date: 2025-07-31 11:02:26
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-01 16:25:23
 */
import request from '@/utils/request';

export const loginApi = {
  // 获取登录页图片
  getLoginPicApi() {
    return request.get('/getLoginPic')
  },
  // 登陆
  login(data: object) {
    return request.post('/login', data)
  },
  // 获取用户信息
  getAdminInfo() {
    return request.get('/getAdminInfoByToken')
  },
}
