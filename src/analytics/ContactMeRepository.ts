import { Repository } from 'analytics/Repository'
import { AnalyticDataRows, AnalyticsPayload, ContactMe } from 'analytics/interfaces'

/**
 * Submit Contact Me repository
 */
export class ContactMeRepository extends Repository {
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
            startDate: '30daysAgo',
            endDate: '1daysAgo',
        },
    ]

    /**
     * Get data from GA4
     */
    public async getData(): Promise<ContactMe> {
        const reports = await this.getAnalytics(this.metrics, this.dimensions, this.dateRanges)

        reports.rows = reports.rows
            .filter((row: AnalyticDataRows) => row.dimensionValues[0]?.value === 'submit_contact_me')

        return ContactMeRepository.format(reports)
    }

    /**
     * Format raw GA4 data
     */
    private static format(reports: AnalyticsPayload): ContactMe {
        const [contactMe] = reports?.rows
            .map(
                (row: AnalyticDataRows): ContactMe => ({
                    value: Number(row.metricValues[0].value),
                }),
            )
        return contactMe
    }
}
