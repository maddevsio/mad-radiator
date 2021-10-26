export type ChartType = 'users' | 'sessions'

export interface ChartConfig {
  period: number // current day - period
  type: string
}
