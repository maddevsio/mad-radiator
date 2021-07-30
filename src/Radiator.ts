import { AnalyticsService } from 'analytics'
import { GoogleAuthorization } from 'authorization'
import { ChartBuilder } from 'chartBuilder'
import { ParsedRange, RadiatorConfig, ScheduleConfig } from 'interfaces'
import { Lighthouse } from 'lighthouse'
import { Logger } from 'logger'
import { MessengersService } from 'messengers'
import { Scheduler } from 'scheduler'
import { GoogleDriveStorage } from 'storage'
import { parseRange } from 'utils/parseRange'

export class Radiator {
  private readonly config: RadiatorConfig

  private readonly parsedRange: ParsedRange

  private readonly googleAuthorization: GoogleAuthorization

  private readonly scheduler: Scheduler

  private readonly messengersService: MessengersService

  private readonly chartBuilder: ChartBuilder

  private readonly googleDriveStorage: GoogleDriveStorage

  private readonly lighthouse: Lighthouse

  private readonly analyticsService: AnalyticsService

  constructor(config: RadiatorConfig) {
    this.config = config
    this.parsedRange = parseRange(this.config.range)

    // eslint-disable-next-line

    // instances
    this.googleAuthorization = new GoogleAuthorization(this.config)
    this.scheduler = new Scheduler(this.config.schedule || ({} as ScheduleConfig))
    this.messengersService = new MessengersService(this.config)
    this.chartBuilder = new ChartBuilder()
    this.googleDriveStorage = new GoogleDriveStorage()
    this.lighthouse = new Lighthouse(this.config)
    this.analyticsService = new AnalyticsService(this.config, this.parsedRange)
    if (this.config.schedule) this.scheduleJob()
  }

  private scheduleJob() {
    this.scheduler.scheduleJob(() => this.run())
    Logger.info('Job successfully scheduled')
  }

  public async run() {
    Logger.info('Authorize with googleAuthorization...')
    const { unlink } = await this.googleAuthorization.authorize()

    Logger.info('Getting analytics data...')
    const analytics = await this.analyticsService.getData()

    Logger.info('Getting lighthouse data...')
    const lighthouse = await this.lighthouse.getData()

    if (analytics.chart) Logger.info('Building an image...')
    const imageBuffer = analytics.chart && (await this.chartBuilder.renderChart(analytics.chart))

    if (imageBuffer) Logger.info('Saving an image in gdrive...')
    const imageURL = imageBuffer && (await this.googleDriveStorage.storeFile(imageBuffer))

    Logger.info('Send messages...')
    await this.messengersService.sendMessages({
      analytics,
      lighthouse,
      range: this.parsedRange,
      imageURL,
    })

    await unlink()
    Logger.success('Success!')
  }
}
