import { LighthouseData } from 'lighthouse/interfaces'

export const lighthouseData: LighthouseData = {
  top: [],
  worst: [],
  average: {
    performance: 100,
    accessibility: 100,
    best_practices: 100,
    seo: 100,
    pwa: 100,
  },
  urlCount: 100,
}
