import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Product } from '~/services/api'

@Component
export default class VtProductItem extends Vue {
  @Prop({ type: Object })
  item!: Product
}
