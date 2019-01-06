import Vue, { ComponentOptions } from "vue"
import { MetaInfo } from "vue-meta"

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    head?: MetaInfo | (() => MetaInfo)
    layout?: string
    middleware?: string[]
  }
}

declare module "vue/types/vue" {
  interface Vue {
    head?: MetaInfo | (() => MetaInfo)
    layout?: string
    middleware?: string[]
  }
}
