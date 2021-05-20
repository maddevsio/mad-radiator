import { SchedulePeriod } from 'enums'
import { ScheduleConfig } from 'interfaces'
import { buildCronStringInfo } from 'scheduler/buildCronStringInfo'

describe('Scheduler > buildCronStringInfo', () => {
  let config: ScheduleConfig

  beforeEach(() => {
    config = {
      period: SchedulePeriod.day,
      time: 10,
    }
  })

  it('should return cronstring for day period', () => {
    const cronString = buildCronStringInfo(config)
    expect(cronString).toBe('Schedule is running for an every day at 10:00')
  })

  it('should return cronstring for week period', () => {
    config.period = SchedulePeriod.week
    config.weekDay = 3
    const cronString = buildCronStringInfo(config)
    expect(cronString).toBe('Schedule is running for an every week at 3 day of the week at 10:00')
  })

  it('should return cronstring for month period', () => {
    config.period = SchedulePeriod.month
    config.monthDay = 3
    const cronString = buildCronStringInfo(config)
    expect(cronString).toBe('Schedule is running for an every month at 3 day of the month at 10:00')
  })
})
