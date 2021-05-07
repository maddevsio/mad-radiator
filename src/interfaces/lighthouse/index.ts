import { Rate } from 'enums'

export type LighthouseCategory = {
  id: string
  title: string
  score: number
}

export type LighthousePayload = {
  lighthouseResult: {
    categories: Array<LighthouseCategory>
  }
}

export type LighthouseEntity = {
  title: string
  value: number
  rate: Rate
}

export type LighthouseData = Record<string, LighthouseEntity>
