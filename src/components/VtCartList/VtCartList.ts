import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Container } from '~/ioc'
import { RoundServiceToken } from '~/services/round'
import { ICartStoreItem } from '~/store/modules/cart/ICartStoreItem'

@Component
export default class VtCartList extends Vue {
  roundService = Container.get(RoundServiceToken)

  @Prop({ type: Array, default: () => [] })
  items!: ICartStoreItem[]

  // эти данные можно и вычислять,
  // но они уже вычисляются в хранилище, тогда просто возьмем
  @Prop({ type: Number, default: 0 })
  totalQuantity!: number

  @Prop({ type: Number, default: 0 })
  totalPrice!: number

  itemPriceTotal (item: ICartStoreItem): number {
    return this.roundService.round(item.product.price * item.quantity, -2)
  }

  getSummaries (param) {
    const { columns } = param
    const sums: string[] = new Array(columns.length)
    columns.forEach((column, index) => {
      // выводим "Итого"
      if (index === 1) {
        sums[index] = this.$t('PageCart.totalLabel').toString()
        return
      }
      // выводим общее количество товаров
      if (index === 3) {
        sums[index] = this.totalQuantity.toString()
        return
      }
      // выводим итоговую стоимость
      if (index === 4) {
        sums[index] = '$' + this.roundService.round(this.totalPrice, -2).toString()
        return
      }
      // в остальных колонках ничего не выводим
      sums[index] = ''
    })
    return sums
  }
}
