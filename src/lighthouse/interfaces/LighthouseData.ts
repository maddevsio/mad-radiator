import { LighthouseMetrics, LighthouseUrlResult } from 'lighthouse/interfaces'

export interface LighthouseData {
  top: Array<LighthouseUrlResult>
  worst: Array<LighthouseUrlResult>
  average: LighthouseMetrics
  urlCount: number
}
