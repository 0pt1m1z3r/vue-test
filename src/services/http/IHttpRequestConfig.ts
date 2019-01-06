import { AxiosRequestConfig, AxiosPromise } from 'axios'
import { Cache } from 'lru-cache'

export interface IHttpRequestConfig extends AxiosRequestConfig {
  cache?: boolean | Cache<string, AxiosPromise>
  forceUpdate?: boolean
  security?: boolean
  ignoreAuthInterceptor?: boolean
}
