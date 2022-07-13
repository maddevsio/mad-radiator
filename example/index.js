const { Radiator } = require('../lib')
const config = require('./example.config.json')
const dotenv = require('dotenv');
dotenv.config();

const {
  authConfig,
  analyticsConfig,
  slackConfig,
  lighthouseConfig,
  quora,
  firestoreId,
  redditConfig,
  pageAnalyticsConfig,
} = config

const dailyConfig = {
  ...authConfig,
  analyticsPrivateKey: process.env.RADIATOR_PRIVATE_KEY,
  range: 'day',
}

const radiator = new Radiator(dailyConfig)

radiator.useAnalytics(analyticsConfig)
radiator.useSlack(slackConfig)
radiator.useRedditCountPosts(redditConfig)
// radiator.useQuoraService(quora, firestoreId)
// radiator.useNewPagesInSite(lighthouseConfig, firestoreId)
// radiator.usePageAnalytics(pageAnalyticsConfig, firestoreId)
radiator.run()
