import { VuexModule, Module, Mutation } from 'vuex-module-decorators'
import { ICartStoreItem } from './ICartStoreItem'
import { Product } from '~/services/api'

@Module({ name: 'cartStore' })
export class CartStore extends VuexModule {
  items: ICartStoreItem[] = []

  get totalQuantity (): number {
    return this.items.reduce<number>((accum, item) => {
      return accum + item.quantity
    }, 0)
  }

  get totalPrice (): number {
    return this.items.reduce<number>((accum, item) => {
      return accum + item.product.price * item.quantity
    }, 0)
  }

  @Mutation
  add (product: Product) {
    const item = this.items.find((item) => item.product.id === product.id)
    if (item) {
      item.quantity++
      item.addtime = Date.now()
    } else {
      this.items.push({
        product,
        quantity: 1,
        addtime: Date.now()
      })
    }
  }

  @Mutation
  delete (argItem: ICartStoreItem) {
    this.items = this.items.filter((item) => item.product.id !== argItem.product.id)
  }

  @Mutation
  reset () {
    this.items = []
  }

  @Mutation
  changeQuantity (argItem: ICartStoreItem) {
    const item = this.items.find((item) => item.product.id === argItem.product.id)
    if (item) {
      item.quantity = argItem.quantity
    }
  }
}
