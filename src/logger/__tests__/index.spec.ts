import chalk from 'chalk'
import { error, info, log, success, warning } from 'logger'


describe('Logger module', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'log').mockImplementation(() => undefined)
  })

  it('success', () => {
    success('success')
    expect(console.log).toHaveBeenCalledWith(chalk.green.bold('success'))
  })

  it('log', () => {
    log('log')
    expect(console.log).toHaveBeenCalledWith('log')
  })

  it('error', () => {
    error('error')
    expect(console.log).toHaveBeenCalledWith(chalk.red.bold('error'))
  })

  it('info', () => {
    info('info')
    expect(console.log).toHaveBeenCalledWith(chalk.blue.bold('info'))
  })

  it('warning', () => {
    warning('warning')
    expect(console.log).toHaveBeenCalledWith(chalk.yellow.bold('warning'))
  })
})
