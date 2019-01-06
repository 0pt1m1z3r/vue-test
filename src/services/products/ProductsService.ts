import { Service, Token, Inject } from '~/ioc'
import { IProductsService } from './IProductsService'
import { ApiServiceToken, IApiService, Product } from '~/services/api'
import { IHttpRequestConfig } from '~/services/http'

export const ProductsServiceToken = new Token<IProductsService>()

// сервис для работы с товарами
@Service(ProductsServiceToken)
export class ProductsService implements IProductsService {
  constructor (
    @Inject(ApiServiceToken) private apiService: IApiService
  ) {}

  // получение списка товаров
  async getProductsList (config?: IHttpRequestConfig): Promise<Product[]> {
    config = Object.assign<IHttpRequestConfig, IHttpRequestConfig>({ cache: true }, config || {})
    const { data } = await this.apiService.getProductsList(null, config)
    return data
  }
}
