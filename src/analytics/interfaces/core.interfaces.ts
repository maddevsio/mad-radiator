import { Rate } from 'interfaces'

export interface CoreItem {
  value: number | string
  previous: number | string
  difference: string
  rate: Rate
}

export interface CoreItems {
  users: CoreItem
  sessions: CoreItem
  bounceRate: CoreItem
  duration: CoreItem
}
