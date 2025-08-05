/*
 * @Description: pinia数据类型
 * @Author: StarTraceDev
 * @Date: 2025-08-05 14:11:00
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-05 14:13:19
 */
export interface userStateInfo {
  id: number,
  account: string,
  realName: string,
  roles: string,
  roleNames?: string | null,
  lastIp: string,
  lastTime?: string | null,
  addTime?: string | null,
  loginCount: number,
  level: number,
  status: boolean,
  phone: string,
  isSms: boolean,
  permissionsList: string[],
  merStarLevel: number,
  merReceiptPrintingSwitch: number,
  electrPrintingSwitch: number,
  merId: number,
  rectangleLogo: string,
  localFlag: boolean,
  token?: string | null

}
