import { AxiosPromise } from 'axios'

export interface IHttpPromise<T = any> extends AxiosPromise<T> {
}
