/*
 * @Description: 当前页面描述
 * @Author: StarTraceDev
 * @Date: 2025-08-01 13:30:28
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-01 15:01:37
 */
import request from "@/utils/request";

export const routesApi = {
  // 获取路由
  getRoutes() { return request.get('/getMenus') },
}
