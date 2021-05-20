import { SchedulePeriod } from 'enums'
import { ScheduleConfig } from 'interfaces'

export function buildCronStringInfo(scheduleConfig: ScheduleConfig): string {
  let timing = ''

  if (scheduleConfig.period === SchedulePeriod.day) timing = `${scheduleConfig.time}:00`
  if (scheduleConfig.period === SchedulePeriod.week)
    timing = `${scheduleConfig.weekDay} day of the week at ${scheduleConfig.time}:00`
  if (scheduleConfig.period === SchedulePeriod.month)
    timing = `${scheduleConfig.monthDay} day of the month at ${scheduleConfig.time}:00`

  return `Schedule is running for an every ${scheduleConfig.period} at ${timing}`
}
