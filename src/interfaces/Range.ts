export enum RangeType {
  day = 'day',
  week = 'week',
  month = 'month',
}

export interface Range {
  startDate: string
  endDate: string
}

export interface ParsedRange {
  range: RangeType
  originalRange: Range
  previousRange: Range
  text: string
}
