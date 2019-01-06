import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import { Product } from '~/services/api'
import { CartStore } from '~/store/modules/cart'

@Component
export default class VtProductItem extends Vue {
  cartStore!: CartStore

  @Prop({ type: Object })
  item!: Product

  created () {
    // инициализация хранилища
    this.cartStore = getModule(CartStore, this.$store)
  }

  get quantity () {
    const cartItem = this.cartStore.items.find((item) => item.product.id === this.item.id)
    return cartItem ? cartItem.quantity : 0
  }
}
