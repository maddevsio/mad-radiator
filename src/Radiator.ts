import { ParsedRange, RadiatorConfig } from 'interfaces'
import { AnalyticsService } from 'services/Analytics.service'
import { LighthouseService } from 'services/Lighthouse.service'
import { LoggerService } from 'services/Logger.service'
import { MessengersService } from 'services/Messengers.service'
import { SchedulerService } from 'services/Scheduler.service'
import { parseRange } from 'utils/parseRange'

export class Radiator {
  private readonly config: RadiatorConfig

  private readonly parsedRange: ParsedRange

  private readonly schedulerService?: SchedulerService

  private readonly messengersService: MessengersService

  private readonly lighthouseService: LighthouseService

  private readonly analyticsService: AnalyticsService

  constructor(config: RadiatorConfig) {
    this.config = config
    this.parsedRange = parseRange(this.config.range)

    // eslint-disable-next-line

    // instances
    this.schedulerService = this.config.schedule && new SchedulerService(this.config.schedule)
    this.messengersService = new MessengersService(this.config)
    this.lighthouseService = new LighthouseService(this.config)
    this.analyticsService = new AnalyticsService(this.config, this.parsedRange)
    if (this.schedulerService) this.scheduleJob()
  }

  private scheduleJob() {
    this.schedulerService?.scheduleJob(() => this.runScript())
    LoggerService.info('Job successfully scheduled')
  }

  public async run() {
    this.runScript()
  }

  private async runScript() {
    LoggerService.info('Getting analytics data...')
    const analytics = await this.analyticsService.getData()

    LoggerService.info('Getting lighthouse data...')
    const lighthouse = await this.lighthouseService.getData()

    LoggerService.info('Send messages...')
    await this.messengersService.send(analytics, lighthouse, this.parsedRange)
    LoggerService.success('Success!')
  }
}
