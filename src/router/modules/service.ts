/*
 * @Description: 客服
 * @Author: StarTraceDev
 * @Date: 2025-08-11 09:16:40
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-11 09:23:03
 */
import type { Component } from 'vue'

export const serviceRoutes: Record<string, Component> = {
  '/service/vipcomplain': () => import('@/views/service/vipcomplain/index.vue'),
  '/service/needfeedback': () => import('@/views/service/needfeedback/index.vue'),
  '/service/activatethegrid': () => import('@/views/service/activatethegrid/index.vue'),
  '/service/notice': () => import('@/views/service/notice/index.vue'),
}
