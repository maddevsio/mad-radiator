import { GoogleAuthorization } from 'authorization'
import { AuthorizationError } from 'errors/types/AuthorizationError'
import { GoogleApis } from 'googleapis'
import { RadiatorConfig, ScheduleConfig } from 'interfaces'
import { Logger } from 'logger'
import { Scheduler } from 'scheduler'

import { BuildMessageDataSpec } from './messengers/interfaces'
import { MessageService, RadiatorService, RadiatorSpec } from './radiator-spec'
import { SentryService } from './sentry/sentryService'
import { executeWithRetry } from './utils/executeWithRetry'

export class Radiator implements RadiatorSpec {
  private services: RadiatorService[] = []

  private readonly messageService: MessageService | undefined

  private readonly config: RadiatorConfig

  private authorization!: { google: GoogleApis }

  constructor(config: RadiatorConfig, messageService: MessageService) {
    this.messageService = messageService
    this.config = config
  }

  get authorized(): boolean {
    return Boolean(this.authorization)
  }

  register(service: RadiatorService) {
    this.services.push(service)
  }

  async execute() {
    new Scheduler(this.config.scheduleConfig || ({} as ScheduleConfig)).scheduleJob(async () => {
      Logger.info(`ScheduleJob: starting`)
      const googleAuthorization = new GoogleAuthorization(this.config)
      const sentry = new SentryService(this.config.sentryConfig)
      this.authorization = await executeWithRetry(
        'googleAuthorization.authorize()',
        5,
        1500,
        () => googleAuthorization.authorize(),
        (error: any) => error instanceof AuthorizationError,
      )
      try {
        let messageData: BuildMessageDataSpec = {}
        for (const service of this.services) {
          const serviceName = service.getName()
          Logger.info(`${serviceName}: Starting.`)
          try {
            messageData = {
              ...(await service.perform(messageData, this)),
            }
            Logger.info(`${serviceName}: Done.`)
          } catch (error) {
            Logger.error(`${serviceName}: ${error}`)
            sentry.sendErrorToSentry(error)
          }
        }
        if (this.messageService) this.messageService.sendMessages(messageData)
      } finally {
        Logger.info(`ScheduleJob: completed.`)
      }
    })
  }
}
