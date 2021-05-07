import { Rate } from 'enums'

export interface LighthouseCategory {
  id: string
  title: string
  score: number
}

export interface LighthousePayload {
  lighthouseResult: {
    categories: Array<LighthouseCategory>
  }
}

export interface LighthouseEntity {
  title: string
  value: number
  rate: Rate
}

export type LighthouseData = Record<string, LighthouseEntity>
