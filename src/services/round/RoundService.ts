import { Service, Token, Inject } from '~/ioc'
import { IRoundService } from './IRoundService'

export const RoundServiceToken = new Token<IRoundService>()

// сервис предоставляет корректные и удобные методы округления чисел
// Источник:
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/round
@Service(RoundServiceToken)
export class RoundService implements IRoundService {
  round (value: number, exp: number): number {
    return this.decimalAdjust('round', value, exp)
  }

  floor (value: number, exp: number): number {
    return this.decimalAdjust('floor', value, exp)
  }

  ceil (value: number, exp: number): number {
    return this.decimalAdjust('ceil', value, exp)
  }

  protected decimalAdjust (type: 'round' | 'floor' | 'ceil', value: number, exp: number = 0): number {
    // Если значение не является числом, либо степень не является целым числом...
    if (isNaN(value) || exp % 1 !== 0) {
      return NaN
    }
    if (exp === 0) {
      return Math[type](value)
    }
    // Сдвиг разрядов
    const parts1 = value.toString().split('e')
    const temp = Math[type](+(parts1[0] + 'e' + (parts1[1] ? (+parts1[1] - exp) : -exp)))
    // Обратный сдвиг
    const parts2 = temp.toString().split('e')
    return +(parts2[0] + 'e' + (parts2[1] ? (+parts2[1] + exp) : exp))
  }
}
