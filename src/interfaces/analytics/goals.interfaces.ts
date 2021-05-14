import { Rate } from 'enums'
import { Emoji } from 'interfaces'

export interface Goal {
  name: string
  emoji: Emoji
  value: number | string
  previous: number | string
  rate?: Rate
  difference?: string
}

export type Goals = Array<Goal>

export interface AnalyticsConversion {
  name: string
  emoji: Emoji
  goals: Array<number>
}
