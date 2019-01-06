import { ICartStoreItem } from '~/store/modules/cart/ICartStoreItem'

export interface IOrderService {
  order (items: ICartStoreItem[]): Promise<void>
}
