import { ParsedRange, RadiatorConfig, ScheduleConfig } from 'interfaces'
import { AnalyticsService } from 'services/Analytics.service'
import { ChartService } from 'services/Chart.service'
import { GoogleAuthService } from 'services/GoogleAuth.service'
import { LighthouseService } from 'services/Lighthouse.service'
import { LoggerService } from 'services/Logger.service'
import { MessengersService } from 'services/Messengers.service'
import { SchedulerService } from 'services/Scheduler.service'
import { StorageService } from 'services/Storage.service'
import { parseRange } from 'utils/parseRange'

export class Radiator {
  private readonly config: RadiatorConfig

  private readonly parsedRange: ParsedRange

  private readonly googleAuthService: GoogleAuthService

  private readonly schedulerService: SchedulerService

  private readonly messengersService: MessengersService

  private readonly chartService: ChartService

  private readonly storageService: StorageService

  private readonly lighthouseService: LighthouseService

  private readonly analyticsService: AnalyticsService

  constructor(config: RadiatorConfig) {
    this.config = config
    this.parsedRange = parseRange(this.config.range)

    // eslint-disable-next-line

    // instances
    this.googleAuthService = new GoogleAuthService(this.config)
    this.schedulerService = new SchedulerService(this.config.schedule || ({} as ScheduleConfig))
    this.messengersService = new MessengersService(this.config)
    this.chartService = new ChartService()
    this.storageService = new StorageService()
    this.lighthouseService = new LighthouseService(this.config)
    this.analyticsService = new AnalyticsService(this.config, this.parsedRange)
    if (this.config.schedule) this.scheduleJob()
  }

  private scheduleJob() {
    this.schedulerService.scheduleJob(() => this.run())
    LoggerService.info('Job successfully scheduled')
  }

  public async run() {
    LoggerService.info('Authorize with google...')
    const { unlink } = await this.googleAuthService.authorize()

    LoggerService.info('Getting analytics data...')
    const analytics = await this.analyticsService.getData()

    LoggerService.info('Getting lighthouse data...')
    const lighthouse = await this.lighthouseService.getData()

    LoggerService.info('Build an image...')
    const imageBuffer = await this.chartService.renderChart(analytics.chart)

    LoggerService.info('Save image in gdrive...')
    const imageURL = await this.storageService.storeFile(imageBuffer)

    LoggerService.info('Send messages...')
    await this.messengersService.send(analytics, lighthouse, this.parsedRange, imageURL)

    await unlink()
    LoggerService.success('Success!')
  }
}
