import { Rate } from 'enums'

export type Goal = {
  value: number | string
  previous: number | string
  rate?: Rate
  difference?: string
}

export type Goals = {
  leads: Goal
  career: Goal
  contacts: Goal
}
