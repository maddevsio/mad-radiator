/* eslint-disable no-console */
import chalk from 'chalk'
import { LoggerService } from 'services/Logger.service'

describe('Logger service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'log').mockImplementation(() => undefined)
  })

  it('success', () => {
    LoggerService.success('success')
    expect(console.log).toHaveBeenCalledWith(chalk.green.bold('success'))
  })

  it('error', () => {
    LoggerService.error('error')
    expect(console.log).toHaveBeenCalledWith(chalk.red.bold('error'))
  })

  it('info', () => {
    LoggerService.info('info')
    expect(console.log).toHaveBeenCalledWith(chalk.blue.bold('info'))
  })

  it('warning', () => {
    LoggerService.warning('warning')
    expect(console.log).toHaveBeenCalledWith(chalk.yellow.bold('warning'))
  })
})
