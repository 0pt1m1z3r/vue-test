import webpack from 'webpack'

const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
  base: '/vue-test/'
} : {}

export default {
  head: {
    title: 'VueTest',
    titleTemplate: (value) => {
      if (!value) return 'VueTest'
      if (value.toLowerCase() === 'vuetest') return 'VueTest'
      return `${value} | VueTest`
    },
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'VueTest'
      },
      {
        name: 'msapplication-TileColor',
        content: '#da532c'
      },
      {
        name: 'theme-color',
        content: '#ffffff'
      }
    ]
  },
  mode: 'spa',
  srcDir: 'src/',
  css: [
    // 'normalize.css',
    '~/assets/styles/index.scss'
  ],
  build: {
    plugins: [
      new webpack.NormalModuleReplacementPlugin(
        /element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/,
        'element-ui/lib/locale/lang/en'
      )
    ]
  },
  plugins: [
    '~/plugins/element-ui',
    '~/plugins/bootstrap',
    { src: '~/plugins/persistedState', ssr: false }
  ],
  modules: [
    '~~/modules/typescript.js',
    '@nuxtjs/style-resources'
  ],
  styleResources: {
    scss: [
      '~/assets/styles/resources.scss'
    ]
  },
  router: {
    middleware: ['i18n'],
    ...routerBase
  }
}
