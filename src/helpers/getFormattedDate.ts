import moment, { unitOfTime } from 'moment'

const DEFAULT_FORMAT = 'DD/MM/YYYY'

export default (range: unitOfTime.DurationConstructor, format: string = DEFAULT_FORMAT) => {
  return moment().subtract(1, range).format(format)
}
