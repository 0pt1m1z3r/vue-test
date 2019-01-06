declare namespace NodeJS {
  interface Process {
    browser: boolean
    client: boolean
    server: boolean
  }

  interface ProcessEnv {
    wsUrl: string
  }
}
