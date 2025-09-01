/*
 * @Description: 路由Api
 * @Author: StarTraceDev
 * @Date: 2025-08-01 13:30:28
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-09-01 13:42:57
 */
import request from "@/utils/request";

export const routesApi = {
  // 获取路由
  getRoutes() { return request.get('/getMenus') },
}
