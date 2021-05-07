import { Rate } from 'enums'

export type DeviceTitle = 'desktop' | 'mobile' | 'tablet'

export interface Device {
  title: DeviceTitle
  value: number
  previous: number
  rate?: Rate
  difference?: string
}
