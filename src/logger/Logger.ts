/* eslint-disable no-console */
import chalk from 'chalk'

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
}
