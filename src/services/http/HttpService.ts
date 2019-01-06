import { Service, Token } from '~/ioc'
import Axios, { AxiosInstance, AxiosAdapter, AxiosRequestConfig } from 'axios'
import { cacheAdapterEnhancer } from 'axios-extensions'
import { IHttpService } from './IHttpService'
import { IHttpPromise } from './IHttpPromise'
import { IHttpResponse } from './IHttpResponse'
import { IHttpRequestConfig } from './IHttpRequestConfig'

export const HttpServiceToken = new Token<IHttpService>()

// сервис для запросов к API серверу
// обертка для axios
@Service(HttpServiceToken)
export class HttpService implements IHttpService {
  private client: AxiosInstance

  constructor (
    client: AxiosInstance
  ) {
    this.client = client || Axios.create(Object.assign<AxiosRequestConfig, AxiosRequestConfig>(
      { timeout: 5000 },
      { adapter: cacheAdapterEnhancer(Axios.defaults.adapter as AxiosAdapter, { enabledByDefault: false }) }
    ))

    this.onRequest((config) => {
      // Send credentials only to relative and API Backend requests
      if (config.withCredentials === undefined) {
        if (!/^https?:\/\//i.test(config.url!) || config.url!.indexOf(config.baseURL!) === 0) {
          config.withCredentials = true
        }
      }
      return config
    })
  }

  request<T = any> (config: IHttpRequestConfig): IHttpPromise<T> {
    return this.client.request(config)
  }
  get<T = any> (url: string, config?: IHttpRequestConfig): IHttpPromise<T> {
    return this.client.get(url, config)
  }
  delete<T = any> (url: string, config?: IHttpRequestConfig): IHttpPromise<T> {
    return this.client.delete(url, config)
  }
  head<T = any> (url: string, config?: IHttpRequestConfig): IHttpPromise<T> {
    return this.client.head(url, config)
  }
  post<T = any> (url: string, data?: any, config?: IHttpRequestConfig): IHttpPromise<T> {
    return this.client.post(url, data, config)
  }
  put<T = any> (url: string, data?: any, config?: IHttpRequestConfig): IHttpPromise<T> {
    return this.client.put(url, data, config)
  }
  patch<T = any> (url: string, data?: any, config?: IHttpRequestConfig): IHttpPromise<T> {
    return this.client.patch(url, data, config)
  }

  onRequest (onFulfilled?: (value: IHttpRequestConfig) => IHttpRequestConfig | Promise<IHttpRequestConfig>, onRejected?: (error: any) => any): number {
    return this.client.interceptors.request.use(onFulfilled, onRejected)
  }
  onResponse (onFulfilled?: (value: IHttpResponse) => IHttpResponse | Promise<IHttpResponse>, onRejected?: (error: any) => any): number {
    return this.client.interceptors.response.use(onFulfilled, onRejected)
  }
}
