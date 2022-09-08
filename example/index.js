const { Radiator } = require('../lib')
const config = require('./example.config.json')
const dotenv = require('dotenv')
const { MessengersService } = require('../lib/messengers')
const { AnalyticsService } = require('../lib/analytics')
const { RedditCountPostsService } = require('../lib/redditPosts')
const { QuoraService } = require('../lib/quora')
const { NewPagesInSiteService } = require('../lib/pagesAnalytics')
const { PageAnalyticsService } = require('../lib/pagesAnalytics')
const { SearchConsoleService } = require('../lib/searchConsole')

dotenv.config()

const {
  authConfig,
  slackConfig,
  newPagesInSiteConfig,
  quora,
  redditConfig,
  pageAnalyticsConfig,
  fireStoreAuthConfig,
  scheduleConfig,
  sentryConfig,
} = config

const dailyConfig = {
  ...authConfig,
  analyticsPrivateKey: process.env.RADIATOR_PRIVATE_KEY,
  range: 'day',
  nodeEnv: process.env.NODE_ENV,
  scheduleConfig,
  sentryConfig,
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

const messengersConfig = {
  websiteUrl: dailyConfig.websiteUrl,
  ...slackConfig,
}

const analyticsConfig = {
  ...config.analyticsConfig,
  websiteUrl: dailyConfig.websiteUrl,
}

const radiator = new Radiator(dailyConfig, new MessengersService(messengersConfig))
radiator.register(new AnalyticsService(analyticsConfig, dailyConfig.range))
radiator.register(new RedditCountPostsService(redditConfig))
radiator.register(new QuoraService(quora, fireStore))
radiator.register(new NewPagesInSiteService(newPagesInSiteConfig, fireStore))
radiator.register(new PageAnalyticsService(pageAnalyticsConfig, fireStore))
radiator.register(new SearchConsoleService(searchConsoleConfig))
radiator.execute()
