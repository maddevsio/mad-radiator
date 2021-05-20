import schedule from 'node-schedule'

export function scheduler(cronString: string, callback: (...args: any[]) => void): void {
  schedule.scheduleJob(cronString, callback)
}
