import { SchedulePeriod } from 'enums'
import { ScheduleConfig } from 'interfaces'

export function buildCronString(scheduleConfig: ScheduleConfig): string {
  if (scheduleConfig.period === SchedulePeriod.day) return `0 ${scheduleConfig.time} * * *`
  if (scheduleConfig.period === SchedulePeriod.week)
    return `0 ${scheduleConfig.time} * * ${scheduleConfig.weekDay}`
  if (scheduleConfig.period === SchedulePeriod.month)
    return `0 ${scheduleConfig.time} ${scheduleConfig.monthDay} * *`
  return ''
}
