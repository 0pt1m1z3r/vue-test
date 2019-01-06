import { Component, Vue } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import { Container } from '~/ioc'
import { OrderServiceToken } from '~/services/order'
import { CartStore } from '~/store/modules/cart'
import { ICartStoreItem } from '~/store/modules/cart/ICartStoreItem'
import { VtCartList } from '~/components/VtCartList'

@Component({
  components: {
    VtCartList
  }
})
export default class PageCart extends Vue {
  orderService = Container.get(OrderServiceToken)

  cartStore!: CartStore
  pending: boolean = false
  orderedSuccess: boolean = false
  orderedError: boolean = false

  created () {
    // инициализация хранилища
    this.cartStore = getModule(CartStore, this.$store)
  }

  // удаляем товар из корзины
  deleteItem (item: ICartStoreItem) {
    this.cartStore.delete(item)
  }

  // очищаем корзину
  reset () {
    this.cartStore.reset()
  }

  // отправляем заказ
  async order () {
    try {
      // индикатор отправки
      this.pending = true
      // отправка запроса
      await this.orderService.order(this.cartStore.items)
      // очищаем корзину
      this.reset()
      // показываем сообщение успешного заказа
      this.orderedSuccess = true
    } catch (e) {
      // показываем сообщение ошибки
      this.orderedError = true
    } finally {
      this.pending = false
    }
  }
}
