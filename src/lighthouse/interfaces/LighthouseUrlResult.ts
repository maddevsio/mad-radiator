import { LighthouseMetrics } from 'lighthouse/interfaces/LighthouseMetrics'

export interface LighthouseUrlResult {
  url: string
  metrics: LighthouseMetrics
  average: number
}
