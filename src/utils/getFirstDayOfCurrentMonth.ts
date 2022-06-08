import moment from 'moment'

export function getFirstDayOfCurrentMonth() {
    return moment().startOf('month').toISOString()
}
