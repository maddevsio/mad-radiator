import { SchedulePeriod } from 'enums'
import { ScheduleConfig } from 'interfaces'
import { buildCronString } from 'scheduler/buildCronString'

describe('Scheduler > buildCronString', () => {
  let config: ScheduleConfig

  beforeEach(() => {
    config = {
      period: SchedulePeriod.day,
      time: 10,
    }
  })

  it('should return cronstring for day period', () => {
    const cronString = buildCronString(config)
    expect(cronString).toBe('0 10 * * *')
  })

  it('should return cronstring for week period', () => {
    config.period = SchedulePeriod.week
    config.weekDay = 3
    const cronString = buildCronString(config)
    expect(cronString).toBe('0 10 * * 3')
  })

  it('should return cronstring for month period', () => {
    config.period = SchedulePeriod.month
    config.monthDay = 3
    const cronString = buildCronString(config)
    expect(cronString).toBe('0 10 3 * *')
  })

  it('should return an empty string if period is not correct', () => {
    config.period = 'smth' as SchedulePeriod
    const cronString = buildCronString(config)
    expect(cronString).toBe('')
  })
})
