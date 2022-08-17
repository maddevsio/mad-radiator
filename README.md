# MAD RADIATOR
---
Mad radiator is a simple script to collect a part of data from analytics, lighthouse, reddit, quora, glassdoor, and send it in the pretty format as message to slack and/or telegram

### How to run

##### Running as function

To run radiator for your own project you need to do the following steps:

* Install radiator as a dependency for your project(or for a new project, that's not important)

```bash
$ npm install @maddevs/mad-radiator
```

* Create a file for running:

```bash
$ touch radiator.js
```

*In the file, you need to import the radiator and pass the configs optionally for each module (see the configuration section):

```javascript
const { radiator } = require('@maddevs/mad-radiator')

const radiator = new Radiator(baseConfig)
radiator.useAnalytics(analyticsConfig)
radiator.useRedditCountPosts(redditConfig)
radiator.useQuoraService(quora, fireStore)
radiator.useGlassdoorService(glassdoor, fireStore)
radiator.useNewPagesInSite(lighthouseConfig, fireStore)
radiator.usePageAnalytics(pageAnalyticsConfig, fireStore)
radiator.useSlack(slackConfig)
```

* Just run the file via nodeJS:

```bash
$ node radiator
```

* Congrats! Now you just running radiator and it will send messages to your slack/telegram according to provided config

##### Running as CLI script

Sorry! Running the radiator by CLI script isn't available for now

### Technologies stack

#### Core

It is a list of core technologies that we used to make a business logic

* node.js
* axios
* googleapis
* node-emoji
* node-schedule
* chalk
* cheerio
* firebase-admin
* moment
* reddit
* sitemap-stream-parser

#### Additional

Additional tools for development

* typescript
* jest
* prettier
* eslint

### Configuration

This is a most important part of the documentation. For running radiator you need to create the correct config (* required configs). In this section you can find all available options of the radiator:

#### Base config *

| name                     | type        | description                                                   |
| -------------------------|:------------|:--------------------------------------------------------------|
| authType                 | string      | Authentication type                                           |
| analyticsProjectId       | string      | ID of your project (it’s available after project creation)    |
| analyticsPrivateKeyId    | string      | Private key ID                                                |
| analyticsPrivateKey      | string      | Private key                                                   |
| analyticsClientEmail     | string      | Client email                                                  |
| analyticsClientId        | string      | Client ID                                                     |
| analyticsAuthUrl         | string      | Auth URL                                                      |
| analyticsTokenUri        | string      | Token URI                                                     |
| analyticsProviderCertUrl | string      | Provider cert URL                                             |
| analyticsClientCertUrl   | string      | Client cert URL                                               |
| googleapisKey            | string      | Google apis key                                               |
| expiryDate               | number      | Expiry date                                                   |
| tokenType                | string      | Token type                                                    |
| idToken                  | string      | ID token                                                      |
| websiteUrl               | string      | Website URL                                                   |
| range                    | string      | Range                                                         |
| retryAttempts            | number      | Retry attempts (Number of radiator restarts)                  |
| nodeEnv                  | string      | Node env                                                      |

#### Analytics config

| name                       | type           | description                                     |
| ---------------------------|:-------------  |:------------------------------------------------|
| totalUsersToEnji           | { url: string }| After create a business goal in the enji - we get endpoint urls to send data from radiator|
| analyticsViewId            | string         | Analytics auth type                             |
| pagesPathForViewsAnalytics | array          | List with page paths for analyzing user traffic |
| analyticsConversions       | array         | List of analytics conversions                   |

#### Pages path for views analytics

PagesPathForViewsAnalytics array needed to get statistics of views on these page paths

```javascript
const analyticsConfig = {
  // ...
  "pagesPathForViewsAnalytics": [
    "/customer-university/",
    "/blog/"
  ],
  // ...
};
```

#### Analytics Conversions

Analytics conversion array need to collect data from your analytics goals and calculate it. For example, you want to
separate your goals by 3 categories: `Leads`, `Contacts` and `Careers`. You can do it using this configuration
parameter.

| name                 | type           | description                       |
| -------------        |:-------------  |:----------------------------------|
| name                 | string         | The name of your conversion group |
| emoji                | Emoji          | Emoji to display your group       |
| goals                | Array<number>  | An array of your goals ids        |

Example. If you want to collect data for careers from goals 1,2,3 and for leads from 4,5,11 goals:

```javascript
const analyticsConfig = {
  //...
  analyticsConversions: [
    {
      name: 'Careers',
      emoji: 'zap',
      goals: [1, 2, 3],
    },
    {
      name: 'Leads',
      emoji: 'briefcase',
      goals: [4, 5, 11],
    },
  ]
  //...
}
```

#### Lighthouse Config

| name                 | type           | description                      |
| -------------        |:-------------  |:---------------------------------|
| urlTestRegexp        | string         | Regular for excluding some pages |
| topCount             | number         | Number of top pages to display   |
| worstCount           | number         | Number of worst pages to display |

Example

```javascript
const lighthouseConfig = {
  "urlTestRegexp": "(\\/blog\\/)|(\\/customer-university\\/)|(\\/ru\\/)[a-zA-Z0-9]{1}",
  "topCount": 3,
  "worstCount": 3
}
```

#### Glassdoor config

| name                 | type           | description              |
| -------------        |:-------------  |:-------------------------|
| glassdoorUrl         | string         | The URL of your account  |

Example

```json
// ...
"glassdoor": {
  "glassdoorUrl": "https://www.glassdoor.com/Overview/account-url"
},
// ...
```

#### Reddit config

The reddit library is used for easy interaction with the API. Data about the number of posts is requested from Reddit.

| name                 | type           | description                            |
| -------------        |:-------------  |:---------------------------------------|
| redditClientId       | string         | Reddit client ID from Reddit APP       |
| redditClientSecret   | string         | Reddit client secret from Reddit APP   |
| redditUserName       | string         | Reddit username account                |
| redditPassword       | string         | Reddit password account                |

Example

```json
// ...
"redditConfig": {
  "redditClientId": "clientid",
  "redditClientSecret": "clientsecret",
  "redditUsername": "username",
  "redditPassword": "password"
},
// ...
```

#### Firestore auth config

| name                         | type           | description                   |
| -------------                |:-------------  |:------------------------------|
| authType                     | string         |                               |
| firestoreProjectId           | string         |                               |
| firestorePrivateKeyId        | string         |                               |
| firestoreClientEmail         | string         |                               |
| firestoreClientId            | string         | From Firestore auth JSON file |
| firestoreAuthUri             | string         |                               |
| firestoreTokenUri            | string         |                               |
| firestoreAuthProviderCertUrl | string         |                               |
| firestoreClientCertUrl       | string         |                               |

Example

```json
// ...
"fireStoreAuthConfig": {
  "authType": "service_account",
  "firestoreProjectId": "project-id",
  "firestorePrivateKeyId": "private-key-id",
  "firestoreClientEmail": "client-email",
  "firestoreClientId": "1111111111111111",
  "firestoreAuthUri": "https://accounts.google.com/o/oauth2/auth",
  "firestoreTokenUri": "https://oauth2.googleapis.com/token",
  "firestoreAuthProviderCertUrl": "https://www.googleapis.com/oauth2/v1/certs",
  "firestoreClientCertUrl": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2dolj%client-cert-url"
},
// ...
```

#### Slack Config

| name                 | type           | description                  |
| -------------        |:-------------  |:-----------------------------|
| slackWebhookUrl      | string         | slack webhook url            |
| slackChannelId       | string         | name of your slack channel   |

#### Schedule *

Schedule options is used for set up custom scheduler for your radiator.

**If you want to run your radiator manually(when run the script) you don't need to provide the `schedule`
configuration**

| name       | type            | description                                                             |
| -----------|:-------------  |:-------------------------------------------------------------------------|
| period     | day/week/month | Period for your schedule                                                 |
| cron       | string         | A custom cron string(all other arguments will skip)                      |
| time       | number         | Time to send a message(0-23)                                             |
| weekDay    | number         | Weekday to send a message(0-7, 0 and 7 is Sunday) - only for period=week |
| monthDay   | number         | Monthday to send a message(0-31) - only for period=month                 |

Example. You want to run your radiator script each day at 10AM. For this you need to use the following configuration:

```json
// ...
"scheduleConfig: {
  "period": "day",
  "cron": '12 15 * * *',
}
// ...
```

### Git commit format
```
The commit contains the following structural elements, to communicate intent to the consumers of your library:

fix: a commit of the type fix patches a bug in your codebase (this correlates with PATCH in Semantic Versioning).
feat: a commit of the type feat introduces a new feature to the codebase (this correlates with MINOR in Semantic Versioning).
BREAKING CHANGE: a commit that has a footer BREAKING CHANGE:, or appends a ! after the type/scope, introduces a breaking API change (correlating with MAJOR in Semantic Versioning). A BREAKING CHANGE can be part of commits of any type.
types other than fix: and feat: are allowed, for example @commitlint/config-conventional (based on the the Angular convention) recommends build:, chore:, ci:, docs:, style:, refactor:, perf:, test:, and others.
footers other than BREAKING CHANGE: <description> may be provided and follow a convention similar to git trailer format.
```
