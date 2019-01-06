import { IHttpRequestConfig } from '~/services/http'
import { Product } from '~/services/api'

export interface IProductsService {
  getProductsList (config?: IHttpRequestConfig): Promise<Product[]>
}
