import { Rate } from 'enums'
import { LighthouseData } from 'interfaces/lighthouse'

export const lighthouseData: LighthouseData = {
  performance: {
    title: 'Access',
    value: 100,
    rate: Rate.good,
  },
  accessibility: {
    title: 'Access',
    value: 100,
    rate: Rate.good,
  },
  'best-practices': {
    title: 'Access',
    value: 100,
    rate: Rate.good,
  },
  seo: {
    title: 'Access',
    value: 100,
    rate: Rate.good,
  },
  pwa: {
    title: 'Access',
    value: 100,
    rate: Rate.good,
  },
}