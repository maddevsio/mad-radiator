import { ScheduleConfig, SchedulePeriod } from 'interfaces'
import schedule from 'node-schedule'
import { Scheduler } from 'scheduler/Scheduler'

jest.mock('node-schedule', () => ({
  scheduleJob: jest.fn((str, cb) => cb(str)),
}))

describe('Scheduler', () => {
  let config: ScheduleConfig

  beforeEach(() => {
    config = {
      period: SchedulePeriod.day,
      cron: '* * * * *',
    }
  })

  it('should created correctly', () => {
    const service = new Scheduler(config)
    expect(service.scheduleJob).toBeTruthy()
  })
  it('scheduleJob method with custom cronString', () => {
    const service = new Scheduler(config)
    const cb = jest.fn()

    service.scheduleJob(cb)

    expect(schedule.scheduleJob).toHaveBeenCalledWith(config.cron, cb)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('scheduleJob method with daily cronString', () => {
    config.cron = ''
    config.period = SchedulePeriod.day
    config.time = 14
    const service = new Scheduler(config)
    const cb = jest.fn()

    service.scheduleJob(cb)

    expect(schedule.scheduleJob).toHaveBeenCalledWith('0 14 * * *', cb)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('scheduleJob method with weekly cronString', () => {
    config.cron = ''
    config.period = SchedulePeriod.week
    config.time = 14
    config.weekDay = 3
    const service = new Scheduler(config)
    const cb = jest.fn()

    service.scheduleJob(cb)

    expect(schedule.scheduleJob).toHaveBeenCalledWith('0 14 * * 3', cb)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('scheduleJob method with monthly cronString', () => {
    config.cron = ''
    config.period = SchedulePeriod.month
    config.time = 14
    config.monthDay = 3
    const service = new Scheduler(config)
    const cb = jest.fn()

    service.scheduleJob(cb)

    expect(schedule.scheduleJob).toHaveBeenCalledWith('0 14 3 * *', cb)
    expect(cb).toHaveBeenCalledTimes(1)
  })
})
