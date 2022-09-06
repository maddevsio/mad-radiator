/* eslint-disable */
import { Logger } from 'logger'
import { sleep } from './sleep'

export async function executeWithRetry(
  prompt: string,
  retryCount: number,
  sleepMs: number,
  successCb: () => any,
  errorCb: (error: any) => any,
) {
  Logger.info(`${prompt}: Starting.`)
  for (let attempt = 1; attempt <= retryCount; attempt += 1) {

    function promptStr(): string {
      return `${prompt} attempt ${attempt}:`
    }

    try {
      if (attempt > 1) Logger.info(`${promptStr()} Trying getting data.`)
      const result = await successCb()
      if (attempt > 1) Logger.info(`${promptStr()} Success.`)
      return result
    } catch (error: any) {
      Logger.error(`${promptStr()} ${error}`)
      if (attempt > retryCount - 1 || !errorCb(error)) throw error
      await sleep(sleepMs)
    }
  }
}
