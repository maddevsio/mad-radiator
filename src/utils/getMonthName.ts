import moment from 'moment'

import { capitalize } from './capitalize'

export function getMonthName(): string {
  moment.locale('ru')
  const getCurrentMonth = moment().format('MMMM')
  return capitalize(getCurrentMonth)
}
