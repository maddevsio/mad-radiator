import { RadiatorConfig } from 'interfaces'
import { LoggerService } from 'logger/Logger.service'
import { MessengersService } from 'messengers/Messengers.service'
import { SchedulerService } from 'scheduler/Scheduler.service'

export class Radiator {
  private readonly config: RadiatorConfig

  private readonly schedulerService?: SchedulerService

  private readonly messengersService: MessengersService

  constructor(config: RadiatorConfig, autorun: boolean = true) {
    this.config = config

    // instances
    this.schedulerService = this.config.schedule && new SchedulerService(this.config.schedule)
    this.messengersService = new MessengersService(this.config)

    // running
    if (autorun) this.start()
  }

  public start() {
    LoggerService.info('Starting...')
    if (this.schedulerService) this.schedulerService.scheduleJob(() => this.runScript())
    else this.runScript()
  }

  private runScript() {
    console.log(this.messengersService)
  }
}
