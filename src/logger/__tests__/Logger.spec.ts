/* eslint-disable no-console */
import chalk from 'chalk'
import { Logger } from 'logger'

describe('Logger service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'log').mockImplementation(() => undefined)
  })

  it('success', () => {
    Logger.success('success')
    expect(console.log).toHaveBeenCalledWith(chalk.green.bold('success'))
  })

  it('error', () => {
    Logger.error('error')
    expect(console.log).toHaveBeenCalledWith(chalk.red.bold('error'))
  })

  it('info', () => {
    Logger.info('info')
    expect(console.log).toHaveBeenCalledWith(chalk.blue.bold('info'))
  })

  it('warning', () => {
    Logger.warning('warning')
    expect(console.log).toHaveBeenCalledWith(chalk.yellow.bold('warning'))
  })
})
