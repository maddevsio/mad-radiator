import chalk from 'chalk'

export function log(message: string): void {
  console.log(message)
}

export function success(message: string): void {
  log(chalk.green.bold(message))
}

export function warning(message: string): void {
  log(chalk.yellow.bold(message))
}

export function error(message: string): void {
  log(chalk.red.bold(message))
}

export function info(message: string): void {
  log(chalk.blue.bold(message))
}
