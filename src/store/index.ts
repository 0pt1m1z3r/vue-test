import Vuex from 'vuex'
import { CartStore } from './modules/cart'

export interface IState {
  cart: CartStore
}

export default () => {
  const store = new Vuex.Store<IState>({
    modules: {
      cartStore: CartStore
    }
  })
  return store
}
