import { SchedulePeriod } from 'enums'
import { ScheduleConfig } from 'interfaces'
import schedule from 'node-schedule'

export class SchedulerService {
  config: ScheduleConfig

  constructor(config: ScheduleConfig) {
    this.config = config
  }

  public scheduleJob(callback: (...args: any[]) => void): void {
    schedule.scheduleJob(this.cronString, callback)
  }

  public get info(): string {
    let timing = ''

    if (this.config.period === SchedulePeriod.day) timing = `${this.config.time}:00`
    if (this.config.period === SchedulePeriod.week)
      timing = `${this.config.weekDay} day of the week at ${this.config.time}:00`
    if (this.config.period === SchedulePeriod.month)
      timing = `${this.config.monthDay} day of the month at ${this.config.time}:00`

    return `Schedule is running for an every ${this.config.period} at ${timing}`
  }

  private get cronString(): string {
    if (this.config.period === SchedulePeriod.day) return `0 ${this.config.time} * * *`
    if (this.config.period === SchedulePeriod.week)
      return `0 ${this.config.time} * * ${this.config.weekDay}`
    if (this.config.period === SchedulePeriod.month)
      return `0 ${this.config.time} ${this.config.monthDay} * *`
    return ''
  }
}
