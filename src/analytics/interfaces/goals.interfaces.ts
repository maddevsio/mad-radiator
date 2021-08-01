import { EmojiType } from 'emoji/interfaces'
import { Rate } from 'interfaces'

export interface Goal {
  name: string
  emoji: EmojiType
  value: number | string
  previous: number | string
  rate?: Rate
  difference?: string
}

export type Goals = Array<Goal>

export interface AnalyticsConversion {
  name: string
  emoji: EmojiType
  goals: Array<number>
}
