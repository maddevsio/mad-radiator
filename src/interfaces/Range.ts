export enum RangeType {
  day = 'day',
  week = 'week',
  month = 'month',
}

export interface Range {
  startDate: string
  endDate: string
}

export type RangeWithDisplay = Range & {
  dateToDisplay: string
}

export interface ParsedRange {
  range:  RangeType | string
  originalRange: Range
  previousRange: Range
  text: string
}
