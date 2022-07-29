import { ParsedRange, RangeType } from 'interfaces'
import moment, { Moment } from 'moment'

const DEFAULT_FORMAT = 'DD/MM/YYYY'

function getYesterday(nodeEnv: string): string {
  if (nodeEnv === 'production') return moment().format(DEFAULT_FORMAT)
  return moment().subtract(1, 'day').format(DEFAULT_FORMAT)
}

function getLastWeek(nodeEnv: string): string {
  const end = getYesterday(nodeEnv)
  const start = moment().subtract(1, 'week').format(DEFAULT_FORMAT)
  return `${start} - ${end}`
}

function getLastMonth(nodeEnv: string): string {
  const end = getYesterday(nodeEnv)
  const start = moment().subtract(1, 'month').format(DEFAULT_FORMAT)
  return `${start} - ${end}`
}

function getTwoDaysAgo(): Moment {
  return moment().subtract(2, 'day')
}

export function parseRange(range: string | RangeType = RangeType.day, nodeEnv: string = ''): ParsedRange {
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
      text: getYesterday(nodeEnv),
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
      text: getLastWeek(nodeEnv),
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
    text: getLastMonth(nodeEnv),
    analyticsDate: getTwoDaysAgo(),
  }
}
