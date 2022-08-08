/* eslint-disable no-console */
import logHelper from 'helpers/logHelper'
import { ParsedRange, RangeType } from 'interfaces'
import moment, { Moment } from 'moment'

const DEFAULT_FORMAT = 'DD/MM/YYYY'

export function getYesterday(): string {
  console.log(`
    Today: ${logHelper(moment(), 'DD/MM/YYYY h:mm:ss a')},
    Yesterday: ${logHelper(moment().subtract(1, 'day'), 'DD/MM/YYYY h:mm:ss a')}
  `)
  return moment().subtract(1, 'day').format(DEFAULT_FORMAT)
}

function getLastWeek(): string {
  const end = getYesterday()
  const start = moment().subtract(1, 'week').format(DEFAULT_FORMAT)
  return `${start} - ${end}`
}

function getLastMonth(): string {
  const end = getYesterday()
  const start = moment().subtract(1, 'month').format(DEFAULT_FORMAT)
  return `${start} - ${end}`
}

export function getTwoDaysAgo(): Moment {
  console.log(`
    Today: ${logHelper(moment(), 'DD/MM/YYYY h:mm:ss a')},
    Two days ago: ${logHelper(moment().subtract(2, 'days'), 'DD/MM/YYYY h:mm:ss a')}
  `);
  return moment().subtract(2, 'day')
}

export function parseRange(range: string | RangeType = RangeType.day): ParsedRange {
  if (range === RangeType.day) {
    return {
      range,
      originalRange: {
        startDate: '1daysAgo',
        endDate: '1daysAgo',
      },
      previousRange: {
        startDate: '2daysAgo',
        endDate: '2daysAgo',
      },
      text: getYesterday(),
      analyticsDate: getTwoDaysAgo(),
    }
  }

  if (range === RangeType.week) {
    return {
      range,
      originalRange: {
        startDate: '7daysAgo',
        endDate: '1daysAgo',
      },
      previousRange: {
        startDate: '14daysAgo',
        endDate: '7daysAgo',
      },
      text: getLastWeek(),
      analyticsDate: getTwoDaysAgo(),
    }
  }

  return {
    range,
    originalRange: {
      startDate: '30daysAgo',
      endDate: '1daysAgo',
    },
    previousRange: {
      startDate: '60daysAgo',
      endDate: '30daysAgo',
    },
    text: getLastMonth(),
    analyticsDate: getTwoDaysAgo(),
  }
}
