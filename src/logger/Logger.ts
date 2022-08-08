/* eslint-disable no-console */
import chalk from 'chalk'
import moment, { unitOfTime } from 'moment'

export class Logger {
  private static log(message: string): void {
    console.log(message)
  }

  public static success(message: string): void {
    this.log(chalk.green.bold(message))
  }

  public static warning(message: string): void {
    this.log(chalk.yellow.bold(message))
  }

  public static error(message: string): void {
    this.log(chalk.red.bold(message))
  }

  public static info(message: string): void {
    this.log(chalk.blue.bold(message))
  }

  public static logMessageDate(functionName: string, range: unitOfTime.DurationConstructor, count: number, format: string): void {
    this.log(`
      ${functionName}():\n
      1. moment().format(${format}): ${moment().format(format)}\n
      2. moment().subtract(${count}, ${range}).format(${format}): ${moment().subtract(count, range).format(format)}\n
    `)
  }
}
