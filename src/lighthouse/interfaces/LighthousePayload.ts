import { LighthouseCategory } from 'lighthouse/interfaces'

export interface LighthousePayload {
  lighthouseResult: {
    categories: Array<LighthouseCategory>
  }
}
