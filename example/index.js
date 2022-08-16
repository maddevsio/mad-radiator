const { Radiator } = require('../lib')
const config = require('./example.config.json')
const dotenv = require('dotenv')
dotenv.config()

const {
  authConfig,
  analyticsConfig,
  slackConfig,
  lighthouseConfig,
  quora,
  glassdoor,
  redditConfig,
  pageAnalyticsConfig,
  fireStoreAuthConfig,
} = config

const dailyConfig = {
  ...authConfig,
  analyticsPrivateKey: process.env.RADIATOR_PRIVATE_KEY,
  range: 'day',
  nodeEnv: process.env.NODE_ENV,
}

const fireStore = {
  ...fireStoreAuthConfig,
  firestorePrivateKey: process.env.RADIATOR_FIRESTORE_PRIVATE_KEY,
}

const searchConsoleConfig = {
  analyticsClientEmail: authConfig.analyticsClientEmail,
  analyticsPrivateKey: process.env.RADIATOR_PRIVATE_KEY.replaceAll('\\n', '\n'),
  website: 'https://maddevs.io/',
  websiteSitemap: 'https://maddevs.io/sitemapindex.xml'
}

const radiator = new Radiator(dailyConfig)

radiator.useAnalytics(analyticsConfig)
radiator.useRedditCountPosts(redditConfig)
radiator.useQuoraService(quora, fireStore)
radiator.useGlassdoorService(glassdoor, fireStore)
radiator.useNewPagesInSite(lighthouseConfig, fireStore)
radiator.usePageAnalytics(pageAnalyticsConfig, fireStore)
radiator.useSearchConsole(searchConsoleConfig)
radiator.useSlack(slackConfig)
radiator.run()
