# MAD RADIATOR
---
Mad radiator is a simple script to collect a part of data from analytics/lighthouse and send it in the pretty format as
message to slack and/or telegram

### How to run

##### Running as function

To run radiator for your own project you need to do the following steps:

* Install radiator as a dependency for your project(or for new project, that's not important)

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
radiator.useLighthouse(lighthouseConfig)
radiator.useSlack(slackConfig)
radiator.useTelegram(telegramConfig)
radiator.scheduleJob(scheduleConfig)
```

* Just run the file via nodeJS

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
* yargs

#### Additional

Additional tools for development

* typescript
* jest
* prettier
* eslint

### Configuration

This is a most important part of the documentation. For running radiator you need to create the correct config (* required configs). In this
section you can find all available options of the radiator:

#### Base config *

| name                     | type           | description                           |
| -------------------------|:-------------  |:--------------------------------------|
| clientId                 | string         | Google client id                      |
| clientSecret             | string         | Google client secret                  |
| redirectUri              | string         | Google redirect Uri                   |
| accessToken              | string         | Google accessToken                    |
| refreshToken             | string         | Google refreshToken                   |
| googleapisKey            | string         | Googleapis key                        |
| range                    | day/week/month | range for collect data from analytics |
| websiteUrl               | string         | Website url for lighthouse            |
| retryAttempts            | number         | number of repeated starts of the radiator when an error occurs|

#### Analytics config

| name                       | type           | description                                     |
| ---------------------------|:-------------  |:------------------------------------------------|
| analyticsViewId            | string         | Analytics auth type                             |
| chart                      | Object         | Setting up for chart                            |
| pagesPathForViewsAnalytics | Array          | List with page paths for analyzing user traffic |
| analyticsConversions       | Object         | List of analytics conversions                   |

#### Chart

| name                 | type                | description                |
| -------------        |:-------------       |:---------------------------|
| period               | day/week/month      | Period for your chart      |
| type                 | users               | Statistics on user traffic |
| chartView            | line/bar/radar/etc. | View of chart              |

Example

```javascript
const analyticsConfig = {
  //...
  chart: {
    chartView: "line",
    period: 150,
    type: "users"
  },
  //...
}
```

#### Pages path for views analytics

PagesPathForViewsAnalytics array needed to get statistics of views on these page paths

```javascript
const analyticsConfig = {
  //...
  pagesPathForViewsAnalytics: [
    "/customer-university/",
    "/insights/blog/"
  ],
  //...
}
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

#### Telegram Config

| name                 | type           | description        |
| -------------        |:-------------  |:-------------------|
| telegramToken        | string         | telegram token     |
| telegramChannelId    | number         | telegram channel Id|

#### slack Config

| name                 | type           | description        |
| -------------        |:-------------  |:-------------------|
| slackWebhookUrl      | string         | slack webhook url  |
| slackChannelId       | string         | slack channel Id   |

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

```javascript

const scheduleConfig = {
  period: 'day',
  time: 10,
}
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
