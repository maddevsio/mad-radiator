import { Repository } from 'analytics/Repository'
import { AnalyticDataRows, AnalyticsPayload, ISubscribers } from 'analytics/interfaces'

/**
 * Submit Contact Me repository
 */
export class SubscribersRepository extends Repository {
    /**
     * GA metrics
     */
    metrics = [{ name: 'eventCount' }]

    /**
     * GA4 dimensions
     */
    dimensions = [{ name: 'eventName' }]

    /**
     * GA4 dateRanges
     */

    dateRanges = [
        {
            startDate: '28daysAgo',
            endDate: '1daysAgo',
        },
    ]

    /**
     * Get data from GA4
     */
    public async getData(): Promise<ISubscribers> {
        const reports = await this.getAnalytics(this.metrics, this.dimensions, this.dateRanges)

        reports.rows = reports.rows
            .filter((row: AnalyticDataRows) => row.dimensionValues[0]?.value === 'submit_newsletter_subscription')

        return SubscribersRepository.format(reports)
    }

    /**
     * Format raw GA4 data
     */
    private static format(reports: AnalyticsPayload): ISubscribers {
        if (!reports.rows.length) return { value: 0 }
        const [subscribers] = reports?.rows
            .map(
                (row: AnalyticDataRows): ISubscribers => ({
                    value: Number(row.metricValues[0].value),
                }),
            )
        return subscribers
    }
}
