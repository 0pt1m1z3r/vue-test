<template lang="pug">
el-container
  el-header
    vt-head
  el-main
    nuxt
</template>

<script>
import { Component, Vue } from 'nuxt-property-decorator'
import VtHead from '~/components/VtHead/VtHead.vue'

@Component({
  components: {
    VtHead
  }
})
export default class LayoutDefault extends Vue {}
</script>
