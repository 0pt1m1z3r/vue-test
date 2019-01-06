import { Service, Token, Inject } from '~/ioc'
import { IOrderService } from './IOrderService'
import { ApiServiceToken, IApiService, OrderItem } from '~/services/api'
import { ICartStoreItem } from '~/store/modules/cart/ICartStoreItem'

export const OrderServiceToken = new Token<IOrderService>()

// сервис для работы с товарами
@Service(OrderServiceToken)
export class OrderService implements IOrderService {
  constructor (
    @Inject(ApiServiceToken) private apiService: IApiService
  ) {}

  // оформление заказа
  async order (items: ICartStoreItem[]): Promise<void> {
    // формируем данные в нужном формате
    const orderItems: OrderItem[] = items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      addtime: item.addtime
    }))
    await this.apiService.order({ body: { items: orderItems } })
  }
}
