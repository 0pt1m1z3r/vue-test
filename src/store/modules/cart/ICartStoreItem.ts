import { Product } from '~/services/api'

export interface ICartStoreItem {
  product: Product
  quantity: number
  addtime: number
}
