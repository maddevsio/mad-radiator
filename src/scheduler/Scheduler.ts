import { ScheduleConfig, SchedulePeriod } from 'interfaces'
import schedule from 'node-schedule'

export class Scheduler {
  private readonly config: ScheduleConfig

  constructor(config: ScheduleConfig) {
    this.config = config
  }

  public scheduleJob(callback: (...args: any[]) => void): void {
    schedule.scheduleJob(this.cronString(), callback)
  }

  private cronString(): string {
    if (this.config.cron) return this.config.cron
    if (this.config.period === SchedulePeriod.day) return `0 ${this.config.time} * * *`
    if (this.config.period === SchedulePeriod.week)
      return `0 ${this.config.time} * * ${this.config.weekDay}`
    return `0 ${this.config.time} ${this.config.monthDay} * *`
  }
}
