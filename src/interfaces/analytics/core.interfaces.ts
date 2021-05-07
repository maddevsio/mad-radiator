import { Rate } from 'enums'

export type CoreItem = {
  value: number | string
  previous: number | string
  difference: string
  rate: Rate
}

export type CoreItems = {
  users: CoreItem
  sessions: CoreItem
  bounceRate: CoreItem
  duration: CoreItem
}
