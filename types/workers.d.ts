interface Window {
  SharedWorker: SharedWorker.SharedWorker
}

declare namespace SharedWorker {
  interface SharedWorkerGlobalScope {
    SharedWorkerGlobalScope
  }
}

declare module "sharedworker-loader?name=workers/[name].shared.[hash:7].js!*" {
  class WebpackSharedWorker extends SharedWorker {
    constructor(name: string)
  }
  export default WebpackSharedWorker
}

declare module "worker-loader?name=workers/[name].[hash:7].js!*" {
  class WebpackWorker extends Worker {
    constructor(name: string)
  }
  export default WebpackWorker
}
