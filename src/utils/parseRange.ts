/* eslint-disable no-console */
import getFormattedDate from 'helpers/getFormattedDate'
import { ParsedRange, RangeType } from 'interfaces'
import moment, { Moment } from 'moment'

export function getYesterday(): string {
  console.log(`getYesterday():\n1. moment().fomat('DD/MM/YYYY h:mm:ss a'): ${moment().format('DD/MM/YYYY h:mm:ss a')}\n2. moment().subtract(1, 'day').format(DEFAULT_FORMAT): ${moment().subtract(1, 'day').format('DD/MM/YYYY h:mm:ss a')}\n`)
  return getFormattedDate('day')
}

function getLastWeek(): string {
  const end = getYesterday()
  const start = getFormattedDate('week')
  return `${start} - ${end}`
}

function getLastMonth(): string {
  const end = getYesterday()
  const start = getFormattedDate('month')
  return `${start} - ${end}`
}

export function getTwoDaysAgo(): Moment {
  console.log(`getTwoDaysAgo(): \n1. moment().format('DD/MM/YYYY h:mm:ss a'): ${moment().format('DD/MM/YYYY h:mm:ss a')}\n2. moment().subtract(2, 'days').format(DEFAULT_FORMAT): ${moment().subtract(2, 'days').format('DD/MM/YYYY h:mm:ss a')}\n`)
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
