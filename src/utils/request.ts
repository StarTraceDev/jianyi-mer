/*
 * @Description: axios 封装拦截
 * @Author: StarTraceDev
 * @Date: 2025-07-31 10:05:49
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-01 16:50:18
 */
import axios, { AxiosHeaders } from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/authStore'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  RawAxiosRequestHeaders,
  Method,
} from 'axios'

// 定义响应数据结构
interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
  [key: string]: unknown // 其他可能的字段
}

// 自定义请求配置
interface RequestConfig extends AxiosRequestConfig {
  headers?: RawAxiosRequestHeaders & {
    Authorization?: string
    [key: string]: unknown
  }
}

class Request {
  private instance: AxiosInstance
  private baseURL: string = '/api/';
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = []; // 刷新 token 期间的请求队列

  constructor() {
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    })

    // 请求拦截器 - 添加 token
    this.instance.interceptors.request.use(
      (config: import('axios').InternalAxiosRequestConfig) => {
        const authStore = useAuthStore()
        const token = authStore.token
        if (token) {
          config.headers = config.headers || {}
          // 使用 AxiosHeaders 设置头部
          const headers = new AxiosHeaders()
          Object.entries(config.headers).forEach(([key, value]) => {
            headers.set(key, value)
          })
          headers.set('authori-zation', `${token}`)
          config.headers = headers
          if (config.method === 'get') {
            config.params = config.params || {};
            config.params.temp = config.params.temp = Math.floor(Date.now() / 1000);
          }
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 处理响应数据
        const res = response.data
        if (res.code === 200) {
          return res
        } else {
          // 处理业务错误
          return ElMessage.error(res.message);
        }
      },
      (error) => {
        // 处理 HTTP 错误
        let message = '请求错误'
        if (error.response) {
          switch (error.response.status) {
            case 401:
              ElMessage.error(message);
              message = '未授权，请重新登录'
              // 这里可以添加跳转到登录页的逻辑
              break
            case 403:
              message = '拒绝访问'
              break
            case 404:
              message = '请求地址错误'
              break
            case 500:
              message = '服务器内部错误'
              break
            default:
              message = `网络错误 (${error.response.status})`
          }
        }
        return Promise.reject(new Error(message))
      },
    )
  }

  // 通用请求方法
  public request<T = unknown>(
    method: Method,
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.instance.request({
      method,
      url,
      data,
      ...config,
    })
  }

  // GET 请求封装
  public get<T = unknown>(
    url: string,
    params?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request('GET', url, undefined, { params, ...config })
  }

  // POST 请求封装
  public post<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request('POST', url, data, config)
  }
}

export default new Request()
