import { RangeType } from 'enums'
import { ParsedRange } from 'interfaces'

function getYesterday(): string {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  const [month, day, year] = date.toLocaleDateString().split('/')
  return `${day}/${month}/${year}`
}

function getLastWeek(): string {
  const end = getYesterday()
  const start = new Date()
  start.setDate(start.getDate() - 7)
  const [month, day, year] = start.toLocaleDateString().split('/')
  return `${day}/${month}/${year} - ${end}`
}

function getLastMonth(): string {
  const end = getYesterday()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  const [month, day, year] = start.toLocaleDateString().split('/')
  return `${day}/${month}/${year} - ${end}`
}

export function parseRange(range: RangeType = RangeType.day): ParsedRange {
  if (range === RangeType.day) {
    return {
      range,
      originalRange: {
        startDate: '1DaysAgo',
        endDate: '1DaysAgo',
      },
      previousRange: {
        startDate: '2DaysAgo',
        endDate: '2DaysAgo',
      },
      text: getYesterday(),
    }
  }

  if (range === RangeType.week) {
    return {
      range,
      originalRange: {
        startDate: '7DaysAgo',
        endDate: '1DaysAgo',
      },
      previousRange: {
        startDate: '14DaysAgo',
        endDate: '7DaysAgo',
      },
      text: getLastWeek(),
    }
  }

  return {
    range,
    originalRange: {
      startDate: '30DaysAgo',
      endDate: '1DaysAgo',
    },
    previousRange: {
      startDate: '60DaysAgo',
      endDate: '30DaysAgo',
    },
    text: getLastMonth(),
  }
}
