import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  // @ts-ignore
  window.onNuxtReady(() => {
    createPersistedState()(store)
  })
}
