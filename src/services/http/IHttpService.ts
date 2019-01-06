import { IHttpPromise } from './IHttpPromise'
import { IHttpResponse } from './IHttpResponse'
import { IHttpRequestConfig } from './IHttpRequestConfig'

export interface IHttpService {
  request<T = any> (config: IHttpRequestConfig): IHttpPromise<T>
  get<T = any> (url: string, config?: IHttpRequestConfig): IHttpPromise<T>
  delete<T = any> (url: string, config?: IHttpRequestConfig): IHttpPromise<T>
  head<T = any> (url: string, config?: IHttpRequestConfig): IHttpPromise<T>
  post<T = any> (url: string, data?: any, config?: IHttpRequestConfig): IHttpPromise<T>
  put<T = any> (url: string, data?: any, config?: IHttpRequestConfig): IHttpPromise<T>
  patch<T = any> (url: string, data?: any, config?: IHttpRequestConfig): IHttpPromise<T>

  onRequest (onFulfilled?: (value: IHttpRequestConfig) => IHttpRequestConfig | Promise<IHttpRequestConfig>, onRejected?: (error: any) => any): number
  onResponse (onFulfilled?: (value: IHttpResponse) => IHttpResponse | Promise<IHttpResponse>, onRejected?: (error: any) => any): number
}
