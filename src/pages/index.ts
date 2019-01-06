import { Component, Vue } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import { Container } from '~/ioc'
import { Product } from '~/services/api'
import { ProductsServiceToken } from '~/services/products'
import { CartStore } from '~/store/modules/cart'
import { VtProductItem } from '~/components/VtProductItem'

@Component({
  components: {
    VtProductItem
  }
})
export default class PageMain extends Vue {
  productsService = Container.get(ProductsServiceToken)

  cartStore!: CartStore
  products: Product[] = []
  pending: boolean = true
  error: boolean = false

  async created () {
    // инициализация хранилища
    this.cartStore = getModule(CartStore, this.$store)

    try {
      // загружаем товары
      this.products = await this.productsService.getProductsList()
    } catch (e) {
      this.error = true
    } finally {
      this.pending = false
    }
  }

  // добавлем товар в корзину
  onAddToCart (product: Product) {
    this.cartStore.add(product)
  }
}
