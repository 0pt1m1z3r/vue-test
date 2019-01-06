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

  async getProductsList (config?: IHttpRequestConfig): Promise<Product[]> {
    try {
      config = Object.assign<IHttpRequestConfig, IHttpRequestConfig>({ cache: true }, config || {})
      const { data } = await this.apiService.getProductsList(null, config)
      return data
    } catch (e) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return this.dummyProducts()
    }
  }

  dummyProducts (): Product[] {
    return [
      {
        id: '1',
        title: 'Товар 1',
        image: 'https://picsum.photos/300/300?image=100',
        price: 100
      },
      {
        id: '2',
        title: 'Товар 2',
        image: 'https://picsum.photos/300/300?image=200',
        price: 99
      },
      {
        id: '3',
        title: 'Товар 3',
        image: 'https://picsum.photos/300/300?image=300',
        price: 45.99
      },
      {
        id: '4',
        title: 'Товар 4',
        image: 'https://picsum.photos/300/300?image=400',
        price: 332
      },
      {
        id: '5',
        title: 'Товар 5',
        image: 'https://picsum.photos/300/300?image=500',
        price: 67
      },
      {
        id: '6',
        title: 'Товар 6',
        image: 'https://picsum.photos/300/300?image=600',
        price: 1999
      }
    ]
  }
}
