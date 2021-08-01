export enum SchedulePeriod {
  day = 'day',
  week = 'week',
  month = 'month',
}

export interface ScheduleConfig {
  period: SchedulePeriod
  cron?: string
  time?: number // hour of days in UTC(0-23)
  weekDay?: number // 0-7 (0 or 7 is Sun)
  monthDay?: number // 1-31
}
