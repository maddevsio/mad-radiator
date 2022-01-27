const { Radiator } = require('../lib')
const config = require('./example.config.json')

const {
  authConfigWithTokens,
  // authConfigWithKeys,

  // sentryConfig,
  analyticsConfig,
  scheduleConfig,
  // telegramConfig,
  slackConfig,
  // lighthouseConfig
} = config

const radiator = new Radiator(authConfigWithTokens)

radiator.useAuthorizationWithTokens(authConfigWithTokens)
// radiator.useAuthorizationWithKeys(authConfigWithKeys)

// radiator.useSentry(sentryConfig)
radiator.useAnalytics(analyticsConfig)
// radiator.useLighthouse(lighthouseConfig)
// radiator.useTelegram(telegramConfig)
radiator.useSlack(slackConfig)
radiator.scheduleJob(scheduleConfig)
radiator.run()
