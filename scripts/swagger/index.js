'use strict'

const fs = require('fs')
const path = require('path')
const child_process = require('child_process')
const util = require('util')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const yaml = require('js-yaml').safeLoad
const _ = require('lodash')
const { compile: jsonSchemaToTypescript } = require('json-schema-to-typescript')

const readFileAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)
const rimrafAsync = util.promisify(rimraf)
const mkdirpAsync = util.promisify(mkdirp)
const exec = util.promisify(child_process.exec);

const oasFilepath = path.join('.', 'api.json')
const outputDir = path.join('src', 'services', 'api')

const subDirDefinitions = 'definitions'
const subDirParams = 'params'
const subDirResponses = 'responses'
const subDirErrors = 'errors'
const filenameIndex = 'index.ts'
const filenameService = 'ApiService.ts'
const filenameServiceInterface = 'IApiService.ts'

run()

async function run () {
  const specPromise = parseSpec(oasFilepath)
  const tplsPromise = loadTemplates([
    path.join(__dirname, 'tplIndex.js'),
    path.join(__dirname, 'tplService.js'),
    path.join(__dirname, 'tplIService.js'),
    path.join(__dirname, 'tplIDefinition.js'),
    path.join(__dirname, 'tplIParams.js'),
    path.join(__dirname, 'tplIResponse.js'),
    path.join(__dirname, 'tplError.js'),
    path.join(__dirname, 'tplErrorClient.js'),
    path.join(__dirname, 'tplErrorsCodes.js'),
  ])
  const dirsPromise = (async function () {
    await rimrafAsync(outputDir)
    await Promise.all([
      mkdirpAsync(path.join(outputDir, subDirDefinitions)),
      mkdirpAsync(path.join(outputDir, subDirParams)),
      mkdirpAsync(path.join(outputDir, subDirResponses)),
      mkdirpAsync(path.join(outputDir, subDirErrors))
    ])
  })()

  const spec = await specPromise
  const [
    tplIndex,
    tplService,
    tplIService,
    tplIDefinition,
    tplIParams,
    tplIResponse,
    tplError,
    tplErrorClient,
    tplErrorsCodes
  ] = await tplsPromise
  await dirsPromise

  const preparedSpec = await prepareSpec(spec)

  generateSingleFile(preparedSpec, tplIndex, filenameIndex)
  generateSingleFile(preparedSpec, tplService, filenameService)
  generateSingleFile(preparedSpec, tplIService, filenameServiceInterface)
  _.forEach(preparedSpec.definitions, (definition) => {
    generateSingleFile(definition, tplIDefinition, path.join(subDirDefinitions, `${definition.name}.ts`))
  })
  _.forEach(preparedSpec.params, (param) => {
    generateSingleFile(param, tplIParams, path.join(subDirParams, `${param.name}.ts`))
  })
  _.forEach(preparedSpec.responses, (response) => {
    generateSingleFile(response, tplIResponse, path.join(subDirResponses, `${response.name}.ts`))
  })
  generateSingleFile({ name: 'ApiServiceRequireError' }, tplError, path.join(subDirErrors, 'ApiServiceRequireError.ts'))
  generateSingleFile({ name: 'ApiServiceClientError' }, tplErrorClient, path.join(subDirErrors, 'ApiServiceClientError.ts'))
  generateSingleFile({ name: 'ApiServiceServerError' }, tplError, path.join(subDirErrors, 'ApiServiceServerError.ts'))
  generateSingleFile({ name: 'ApiServiceError' }, tplError, path.join(subDirErrors, 'ApiServiceError.ts'))
  generateSingleFile(preparedSpec, tplErrorsCodes, path.join(subDirErrors, `ApiServiceErrorsCodes.ts`))
}

async function prepareSpec (spec) {
  const baseUrl = `${spec.schemes[0]}://${spec.host}${spec.basePath}`

  const operations = []
  const definitions = {}
  const params = {}
  const responses = {}
  const errors = new Set()

  // operations
  const operationsPromise = Promise.all(_.map(spec.paths, async (pathMethods, pathKey) => {
    await Promise.all(_.map(pathMethods, async (req, pathMethod) => {
      const consume = (req.consumes || [])[0] || (spec.consumes || [])[0]

      let paramInterfaceName = false
      let responseInterfaceName = false

      const paramsPromise = (async () => {
        const paramInterfaceSchema = getParamInterfaceSchema(req)
        const paramParsed = await parseSchema(paramInterfaceSchema, spec)
        if (paramParsed) {
          const param = paramParsed.shift()
          param.definitions = paramParsed.map((d) => d.name)
          paramInterfaceName = param.name
          params[param.name] = param
        }
      })()

      const responsesPromise = (async () => {
        const responseInterfaceSchema = getResponseInterfaceSchema(req)
        const responseParsed = await parseSchema(responseInterfaceSchema, spec)
        if (responseParsed) {
          const resp = responseParsed.shift()
          resp.definitions = responseParsed.map((d) => d.name)
          responseInterfaceName = resp.name
          responses[resp.name] = resp
        }
      })()

      await paramsPromise
      await responsesPromise

      const responses4xx = filterErrorResponses(req)

      operations.push({
        path: pathKey,
        method: pathMethod.toLowerCase(),
        operationId: req.operationId,
        paramInterfaceName,
        responseInterfaceName,
        security: req.security && req.security.length,
        hasPathParams: pathKey.includes('{'),
        availableParams: _.map(_.countBy(req.parameters, 'in'), (v) => v > 0),
        parameters: req.parameters,
        consume,
        responses4xx
      })

      // errors
      _.forEach(responses4xx, (resp) => {
        const code = _.snakeCase(resp.description).toUpperCase()
        errors.add(code)
      })
    }))
  }))

  // definitions
  const definitionsPromise = Promise.all(_.map(spec.definitions, async (definition, name) => {
    const definitionParsed = await parseSchema({
      ...definition,
      title: name
    }, spec)
    definitions[name] = {
      ...(definitionParsed.find((d) => d.name === name)),
      definitions: definitionParsed
        .filter((d) => d.name !== name)
        .map((definition) => definition.name)
    }
  }))

  await operationsPromise
  await definitionsPromise

  // убираем из responses объекты definitions
  _.forEach(responses, (response, name) => {
    if (definitions[name]) [
      delete responses[name]
    ]
  })

  return {
    baseUrl,
    operations,
    definitions,
    params,
    responses,
    errors: Array.from(errors),
    subDirDefinitions,
    subDirParams,
    subDirResponses,
    subDirErrors
  }
}

// собираем схему для параметров запроса
function getParamInterfaceSchema (req) {
  if (!req.parameters || !req.parameters.length) {
    return null
  }
  const title = `I${_.upperFirst(req.operationId)}Params`
  const schema = {
    title,
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: false
  }
  req.parameters.forEach((param) => {
    const res = Object.assign({}, param)
    if (param.required) {
      schema.required.push(param.name)
    }
    delete res.name
    delete res.in
    delete res.description
    delete res.required
    if (res.schema && res.schema.$ref) {
      res.$ref = res.schema.$ref
      delete res.schema
    }
    schema.properties[param.name] = res
  })
  return schema
}

function getResponseInterfaceSchema (req) {
  const successResponse = findSuccessResponses(req)
  if (!successResponse || !successResponse.schema) {
    return null
  }
  const title = `I${_.upperFirst(req.operationId)}Response`
  const schema = {
    title,
    type: 'object',
    ...successResponse.schema,
    additionalProperties: false
  }
  return schema
}

function findSuccessResponses (req) {
  return _.find(req.responses, (schema, code) => {
    return code >= 200 && code < 400
  })
}

function filterErrorResponses (req) {
  return _
    .chain(req.responses)
    .toPairs()
    .map((parts) => Object.assign(parts[1], { status: parts[0] }))
    .filter((resp) => resp.status >= 400 && resp.status < 500)
    .map((resp) => Object.assign(resp, { name: getErrorName(req, resp) }))
    .value()
}

// Парсер схемы
async function parseSchema (obj, spec) {
  if (!obj) {
    return null
  }
  let data
  let name
  if (obj.$ref) {
    data = { $ref: oasFilepath + obj.$ref }
    name = getNameFromRef(obj.$ref)
  } else
  if (obj.schema) {
    // если есть $ref никаких других полей не должно быть
    // а значит в $ref надо указать и файл
    if (obj.schema.$ref) {
      data = { $ref: oasFilepath + obj.schema.$ref }
      name = getNameFromRef(obj.schema.$ref)
    } else {
      // передаем в парсер свойство schema
      data = Object.assign({}, obj.schema, { definitions: spec.definitions })
    }
  } else {
    // схемы нет, значит тут просто тип
    data = Object.assign({}, obj, { definitions: spec.definitions })
  }
  if (!data) {
    return null
  }
  // console.log('data', name || data.title)
  // console.log(util.inspect(data, {showHidden: false, depth: null}))
  const compiled = await compileSchema(data, name || data.title)
  return compiled.map((compiledItem) => {
    const name = compiledItem.match(/ ([^ ]+) (=|{)/)[1]
    return {
      name,
      compiled: compiledItem
    }
  })
}

// парсит схему и возвращает массив интерфейсов/типов
async function compileSchema (data, name) {
  const compiled = await jsonSchemaToTypescript(data, name || 'Noname', {
    bannerComment: false
  })
  const parts = compiled
    .split('\nexport')
    .map((part) => {
      if (part.indexOf('export') === 0) { return part }
      return 'export' + part
    })
  return parts
}

function getNameFromRef (ref) {
  return ref.match(/\/([^\/]+)$/)[1];
}

function getErrorName (req, resp) {
  return `${camelCase(req.operationId)}Error${camelCase(resp.description)}`
}

function camelCase (str) {
  return _.upperFirst(_.camelCase(str))
}

async function generateSingleFile (spec, tpl, filename) {
  const result = compile(tpl, spec)
  const filepath = path.join(outputDir, filename)
  await writeFileAsync(filepath, result)
  await exec(`node_modules/.bin/tsfmt -r ${filepath}`)
}

function loadTemplates (tpls) {
  return Promise.all(tpls.map((path) => readFileAsync(path, 'utf-8')))
}

function compile (template, spec) {
  return _.template(template)({ spec })
}

async function parseSpec (path) {
  const content = await readFileAsync(path, 'utf-8')
  try {
    return JSON.parse(content)
  } catch (e) {
    return yaml(content)
  }
}

function inspect(val) {
  console.log(util.inspect(val, false, null, true))
}
