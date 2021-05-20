import schedule, {
  Job,
  JobCallback,
  RecurrenceRule,
  RecurrenceSpecDateRange,
  RecurrenceSpecObjLit,
} from 'node-schedule'
import { scheduler } from 'scheduler'

describe('Scheduler index', () => {
  jest.spyOn(schedule, 'scheduleJob').mockImplementation(
    (
      _: string | number | RecurrenceRule | RecurrenceSpecDateRange | RecurrenceSpecObjLit | Date,
      callback: JobCallback,
    ): Job => {
      callback(new Date())
      return new Job('123')
    },
  )

  it('should correctly called scheduleJob with the following params', () => {
    const callback = jest.fn()
    const cronString = '* * * * *'
    scheduler(cronString, callback)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(schedule.scheduleJob).toHaveBeenCalledWith(cronString, callback)
  })
})
