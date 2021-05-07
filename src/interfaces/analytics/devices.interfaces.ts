import { Rate } from 'enums'

export type DeviceTitle = 'desktop' | 'mobile' | 'tablet'

export type Device = {
  title: DeviceTitle
  value: number
  previous: number
  rate?: Rate
  difference?: string
}
