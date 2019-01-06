export class ExtendableError extends Error {
  public payload

  constructor (message: string = '', payload?: any) {
    super(message)
    this.payload = payload

    // if (typeof Error.captureStackTrace === 'function') {
    //   Error.captureStackTrace(this, this.constructor)
    // } else {
    //   this.stack = (new Error(message)).stack
    // }
  }
}
