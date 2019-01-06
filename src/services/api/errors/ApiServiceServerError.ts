// Autogenerated file
import { ExtendableError } from '~/classes/ExtendableError'

export class ApiServiceServerError extends ExtendableError {
    name = 'ApiServiceServerError'

    config
    request
    response

    constructor(message: string = '', payload: any = {}) {
        super(message, payload)
        Object.setPrototypeOf(this, ApiServiceServerError.prototype)

        this.config = payload.config
        this.request = payload.request
        this.response = payload.response
    }
}