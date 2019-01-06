import path from 'path'
import meta from '../package.json'

export { meta }

export default async function module (moduleOptions) {
  const defaultOptions = {
    tsconfig: path.resolve(process.cwd(), 'tsconfig.json')
  }

  const options = {
    ...defaultOptions,
    ...moduleOptions
  }

  this.nuxt.options.extensions.unshift('ts')

  this.extendBuild((config) => {
    config.module.rules.push({
      loader: 'ts-loader',
      test: /(\.tsx?)$/,
      options: {
        appendTsSuffixTo: [/\.vue$/],
        configFile: options.tsconfig,
        transpileOnly: true
      }
    })

    if (config.resolve.extensions.indexOf('.ts') === -1) {
      config.resolve.extensions.unshift('.ts')
    }
  })
}
