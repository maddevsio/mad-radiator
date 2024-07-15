/* eslint-disable */
import { executeWithRetry } from '../executeWithRetry'
import chalk from 'chalk'

interface TestData {
  prompt: string
  attempt: number
  sleepMs: number
  successCb?: any
  errorCb?: any
}

let countCallFunc = 1

const fakeApi = async function () {
  if (countCallFunc === 2) return Promise.resolve('Success!')
  countCallFunc++
  return Promise.reject('Error!.')
}

const spyLog = jest.spyOn(global.console, 'log')

describe('executeWithRetry util', () => {
  const testData: TestData = {
    prompt: 'testFunc()',
    attempt: 5,
    sleepMs: 500,
  }

  afterEach(() => {
    spyLog.mockClear()
  })

  it('should correctly work success callback', async () => {
    testData.successCb = () => Promise.resolve('Success!')
    testData.errorCb = (error: any) => Promise.reject(error)

    const expected = 'Success!'
    const result = await executeWithRetry(
      testData.prompt,
      testData.attempt,
      testData.sleepMs,
      testData.successCb,
      testData.errorCb,
    )

    expect(result).toBe(expected)
    expect(spyLog).toHaveBeenCalledWith(chalk.blue.bold(`${testData.prompt}: Starting.`))
  })

  it('Should return a successful result after 2 attempts', async () => {
    testData.successCb = () => fakeApi()
    testData.errorCb = (error: any) => error

    const expected = 'Success!'
    const result = await executeWithRetry(
      testData.prompt,
      testData.attempt,
      testData.sleepMs,
      testData.successCb,
      testData.errorCb,
    )

    expect(result).toBe(expected)
    expect(spyLog).toHaveBeenCalledTimes(4)
  })

  it('should correctly throw error', async () => {
    testData.successCb = () => Promise.reject('Error!')
    testData.errorCb = (error: any) => error

    const expected = 'Error!'
    try {
      await executeWithRetry(
        testData.prompt,
        testData.attempt,
        testData.sleepMs,
        testData.successCb,
        testData.errorCb,
      )
    } catch (error: any) {
      expect(error).toEqual(expected)
    }
  })
})
