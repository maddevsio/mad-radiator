const { Radiator } = require('../lib')
const config = require('./example.config.json')

const {
  authConfig,
  sentryConfig,
  analyticsConfig,
  lighthouseConfig,
  telegramConfig,
  slackConfig,
  scheduleConfig,
} = config

const radiator = new Radiator(authConfig)
radiator.useSentry(sentryConfig)
radiator.useAnalytics(analyticsConfig)
radiator.useLighthouse(lighthouseConfig)
radiator.useTelegram(telegramConfig)
radiator.useSlack(slackConfig)
radiator.scheduleJob(scheduleConfig)
radiator.run()
