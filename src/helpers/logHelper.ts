import { Moment } from 'moment'

export default (cb: Moment, format: string) => {
  return cb.format(format)
}
