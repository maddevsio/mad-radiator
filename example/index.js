const { Radiator } = require('../lib')

const sentryConfig = {
  sentryDSN: 'https://d81f8c34a94343918882785bbf239060@o556797.ingest.sentry.io/5990845',
  tracesSampleRate: 1.0,
}
const analyticsConfig = {
  analyticsViewId: '230523659',
  range: 'day',
  chart: {
    period: 150,
    type: 'users',
  },
  pagesPathForViewsAnalytics: [
    '/customer-university/',
    '/insights/blog/',
  ],
  analyticsConversions: [
    {
      name: 'Leads',
      emoji: 'zap',
      goals: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
      ],
    },
    {
      name: 'Contacts',
      emoji: 'telephone_receiver',
      goals: [
        10,
        11,
        12,
        13,
        14,
        15,
      ],
    },
    {
      name: 'Careers',
      emoji: 'briefcase',
      goals: [
        9,
      ],
    },
  ],
  websiteUrl: 'https://maddevs.io',
}

const lighthouseConfig = {
  lighthouse: {
    urlTestRegexp: '(\\/blog\\/)|(\\/customer-university\\/)|(\\/ru\\/)[a-zA-Z0-9]{1}',
    topCount: 3,
    worstCount: 3,
  },
  googleapisKey: 'AIzaSyBOEY8LMRkWegkN7qNT0ET1AdfK-9N099M',
}

const telegramConfig = {
  telegramToken: '1729920821:AAFeGKYQZg1zRBhKTFbcz_JIKupRayPiZMs',
  telegramChannelId: -1001456401847,
}

const slackConfig = {
  slackWebhookUrl: 'https://hooks.slack.com/services/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',
  slackChannelId: 'radiator-test-channel',
}

const scheduleConfig = {
  period: 'day',
  time: 10,
}

const mainConfigs = {
  authType: 'service_account',
  analyticsProjectId: 'analytics-radiator',
  analyticsPrivateKeyId: 'fe19df10008580b4c67bfbfab8fe3ebdeecf7a7f',
  analyticsPrivateKey: '-----BEGIN PRIVATE KEY-----\\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDb/CHQAyNKvXTu\\nouS/lx4BDTy3YQytamc8uQyh0g/CdQS1qALGm6kY2Tg7yIlfpvMeBDgOw0PJQfnv\\nHMaDruBhS2WSH7UW+IOFtVrRYYJPXhPyqOy+BhU64CxPyB+w9tDK5VE1JD4quk4v\\no9XZ2Omn7RaFsVFh+3Ubqv1868j5kzPzikfEI4vgVusJZRhIDvqUoI7fuGFl6zoR\\nTXtiysvlp0Nmc/UHeCikBcf4yueULcSO/Z8hnoDAL5XCe1cY19MZ8DS7so77vEGN\\nolWUVvolR3tpbI0X08GqtTY7Lx+Oj0kQv5ycdEKa5CZ+JYALQ/YvqPRkmI/WU5uC\\noll4vf9pAgMBAAECggEAJDCS6XMSs8F+QqH2qtQ0Ae1JD0v+d2r5R+KTgu2ZXR6+\\nIxpcNos2ItndZ+xiOSOwfEAqbrdN6AacFOuxdslmrWrnb0YbFwfUL0N6CNcXRnJO\\nKs4CgHJkvLZTY96i5Ax+pdpa5Tisp3/Vy/2SeU+3hMI6wcy9fDaPeflD0XDCs9fm\\n92mKWPyZZ3YnbBKgvRnzOSQOo/qi6vGf39q/rOJ2Rv7BoeAWteQbnQX99WxsJ0ui\\nbqH8AIX2/4xGyJhD+VtOcoRC8KDbr7zn3GejRR7dkmuktZ/7sWLebnY30HuvPFb/\\n3ogdeUiKLe19iBTD6HJzSZV+JEDqV/BQdU0RPBmsNwKBgQD5UtQqoMD+ZZPhTA0+\\nBAcsOfsHBfuhdLj4k9vTN3SQ1WORxZLDrsGdiU+F8f7xN5y2LacajhDxgdYVw4O7\\nYPTh9dhcQXuuq4NuS9dSwduQCkddMJN1SzUvsdUzurrHLNnOtEsiLBH/BJ7Izofh\\njA2h/VlNyvDz0Q32VCCqg7vkKwKBgQDh4C4Qcjq8ZaDEC2PG2WnsCEtg4plooddz\\nI9d10PBQ5cLdn6bNpPXnt1bXcKboTLvx6o8GuyK4oTPqqKS0AYLaZehYlLfG55QM\\nfEaDZFEb+sxH7z9sdoVVkgvlCscBj03sfN3O5nDI2mO5X4roqE4jkTX0OgLSOHka\\nDHrzd6z8uwKBgFmeST8tW1HWJ0qzcIsbHYzrJm1G3EUT1K0dUMXiSBcLbOfn8bI+\\n7b93rMsDylTgXYcqb8dey35T4iUeiwpedoeGPAglTZTid7K8tiA8KHTlDPPVUxu1\\nNd/39x/J/fs8BuqC6gLVfn6BJaYefr82/Wt9yozo5qVtPqyNXtSL14zTAoGAAqPa\\nJfsP0K/nZyMy8VoNMOMP7nv3iw+JMyFSHWBpzqhA1NJO4sxwy1qLO01nxgNPlw5E\\nybFaQIoxzyZVdn0mCGN0icSDOWHviw3QzSxY/li6FoUnWp8wA8YHOZAcr1n7cS4s\\ncYSkANT8oWgKeZmuACBsXwRmkAp07+cBcOMPNI0CgYAUjLCqXoeP0tVUMD7Yv6Fn\\nqCG44L5u5mvd3iGQMhvnAzx6ORLmhBgetHNoHfQ0aUFl/aExTwu6VzLlLLdXvv0J\\nT9sn8eSyyYUCMGdFKP7OOwivkxE8pi2QwSEvp/EXQ7Vp7oNjXSEl/piA6GnX2Y9T\\nxzeA7DWROZscs87z/krfew==\\n-----END PRIVATE KEY-----\\n',
  analyticsClientEmail: 'radiator@analytics-radiator.iam.gserviceaccount.com',
  analyticsClientId: '108794554451926223006',
  analyticsAuthUrl: 'https://accounts.google.com/o/oauth2/auth',
  analyticsTokenUri: 'https://oauth2.googleapis.com/token',
  analyticsProviderCertUrl: 'https://www.googleapis.com/oauth2/v1/certs',
  analyticsClientCertUrl: 'https://www.googleapis.com/robot/v1/metadata/x509/radiator%40analytics-radiator.iam.gserviceaccount.com',
  googleapisKey: 'AIzaSyBOEY8LMRkWegkN7qNT0ET1AdfK-9N099M',
  range: 'day',
  websiteUrl: 'https://maddevs.io',
}

const radiator = new Radiator(mainConfigs)
radiator.useSentry(sentryConfig)
radiator.useAnalytics(analyticsConfig)
radiator.useLighthouse(lighthouseConfig)
radiator.useTelegram(telegramConfig)
radiator.useSlack(slackConfig)
radiator.scheduleJob(scheduleConfig)
radiator.run()
