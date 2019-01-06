import { Component, Vue } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import { Container } from '~/ioc'
import { RoundServiceToken } from '~/services/round'
import { CartStore } from '~/store/modules/cart'

@Component
export default class VtHead extends Vue {
  roundService = Container.get(RoundServiceToken)

  cartStore!: CartStore

  created () {
    // инициализация хранилища
    this.cartStore = getModule(CartStore, this.$store)
  }

  get formatCartTotalQuantity () {
    return this.roundService.round(this.cartStore.totalQuantity, -2)
  }
  get formatCartTotalPrice () {
    return this.roundService.round(this.cartStore.totalPrice, -2)
  }
  get cartLabel () {
    return {
      quantity: this.formatCartTotalQuantity,
      productsLabel: this.$tc('VtHead.productsLabel', this.formatCartTotalQuantity),
      price: this.formatCartTotalPrice
    }
  }
}
