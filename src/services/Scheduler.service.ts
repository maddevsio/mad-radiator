import { SchedulePeriod } from 'enums'
import { ScheduleConfig } from 'interfaces'
import schedule from 'node-schedule'

export class SchedulerService {
  config: ScheduleConfig

  constructor(config: ScheduleConfig) {
    this.config = config
  }

  public async scheduleJob(callback: (...args: any[]) => void): Promise<schedule.Job> {
    const job = await schedule.scheduleJob(this.cronString(), callback)
    return job
  }

  private cronString(): string {
    if (this.config.cron) return this.config.cron
    if (this.config.period === SchedulePeriod.day) return `0 ${this.config.time} * * *`
    if (this.config.period === SchedulePeriod.week)
      return `0 ${this.config.time} * * ${this.config.weekDay}`
    if (this.config.period === SchedulePeriod.month)
      return `0 ${this.config.time} ${this.config.monthDay} * *`
    return ''
  }
}
