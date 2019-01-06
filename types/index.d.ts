type WithId<T, U = string> = T & { id: U }
type Nullable<T> = { [P in keyof T]: T[P] | null }

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '*.svg' {
  const content: any
  export default content
}

declare module '*.json' {
  const content: any
  export default content
}
