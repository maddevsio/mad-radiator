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
  redditConfig,
  pageAnalyticsConfig,
  fireStoreAuthConfig,
} = config

const dailyConfig = {
  ...authConfig,
  analyticsPrivateKey: process.env.RADIATOR_PRIVATE_KEY,
  range: 'day',
}

const fireStore = {
  ...fireStoreAuthConfig,
  firestorePrivateKey: process.env.RADIATOR_FIRESTORE_PRIVATE_KEY
}

const radiator = new Radiator(dailyConfig)

radiator.useAnalytics(analyticsConfig)
radiator.useSlack(slackConfig)
radiator.useRedditCountPosts(redditConfig)
radiator.useQuoraService(quora, fireStore)
radiator.useNewPagesInSite(lighthouseConfig, fireStore)
radiator.usePageAnalytics(pageAnalyticsConfig, fireStore)
radiator.run()
