/*
 * @Description: 登陆Api
 * @Author: StarTraceDev
 * @Date: 2025-07-31 11:02:26
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-01 09:53:28
 */
import request from '@/utils/request';

export const login = {
  // 获取登录页图片
  getLoginPicApi() {
    return request.get('/getLoginPic')
  },
  // // 登陆
  // loginApi(data: any) {
  //   return request.post('/login', data)
  // },
}
