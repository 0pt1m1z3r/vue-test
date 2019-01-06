export interface IRoundService {
  round (value: number, exp?: number): number
  floor (value: number, exp?: number): number
  ceil (value: number, exp?: number): number
}
