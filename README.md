# MAD RADIATOR
---
Mad radiator is a simple script to collect a part of data from analytics/lighthouse and send it in the pretty format as message to slack and/or telegram

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
* In the file you need to import radiator and build config for running(see config section):
```javascript
const { radiator } = require('@maddevs/mad-radiator')

const config = {
    // ...
}

radiator(config)
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
It is a list of core technologies that we use to make a business logic
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
This is a most important part of the documentation. For running radiator you need to create the correct config. In this section you can find all available options of the radiator:

#### Main config
| name                 | type           | description  |
| -------------        |:-------------  |:-------------------|
| slack                | boolean        | Flag for sending message to slack |
| telegram             | boolean        | Flag for sending message to telegram |
| slackChannelId       | string         | Slack channel name in your workspace('general', for example) |
| telegramChannelId    | number         | Telegram channel id |
| range                | day/week/month | range for collect data from analytics |
| websiteUrl           | string         | Website url for lighthouse |
| analyticsViewId      | string         | Google analytics view id |
| analyticsConversions | Array          | List of analytics conversions |
| env                  | Object         | Enviroment variables object |
| schedule             | Object         | Schedule Object |

#### Analytics Conversions
Analytics conversion array need to collect data from your analytics goals and calculate it.
For example, you want to separate your goals by 3 categories: `Leads`, `Contacts` and `Careers`.
You can do it using this configuration parameter.

| name                 | type           | description  |
| -------------        |:-------------  |:-------------------|
| name                 | string         | The name of your conversion group |
| emoji                | Emoji          | Emoji to display your group |
| goals                | Array<number>  | An array of your goals ids |

Example.
If you want to collect data for careers from goals 1,2,3 and for leads from 4,5,11 goals:
```javascript
const config = {
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

#### Schedule
Schedule options is used for set up custom scheduler for your radiator.

**If you want to run your radiator manually(when run the script) you don't need to provide the `schedule` configuration**

| name       | type            | description  |
| -----------|:-------------  |:-------------------|
| period     | day/week/month | Period for your schedule |
| cron       | string         | A custom cron string(all other arguments will skip) |
| time       | number         | Time to send a message(0-23) |
| weekDay    | number         | Weekday to send a message(0-7, 0 and 7 is Sunday) - only for period=week |
| monthDay   | number         | Monthday to send a message(0-31) - only for period=month |

Example. 
You want to run your radiator script each day at 10AM. 
For this you need to use the following configuration:
```javascript
const config = {
  //...
  schedule: {
    period: 'day',
    time: 10,
  }
  //...
}
```

#### Environment variables
For getting access to analytics, lighthouse, slack and telegram you need to provide a part of tokens for this services.
There is list of all tokens that you need to provide for correct working

**Important: Do not push your private keys to the public repository**

| name                     | type           | description  |
| -------------            |:-------------  |:-------------------|
| authType                 | string         | Analytics auth type |
| analyticsProjectId       | string         | Analytics project id |
| analyticsPrivateKeyId    | string         | Analytics private key id |
| analyticsPrivateKey      | string         | Analytics private key |
| analyticsClientEmail     | string         | Analytics client email |
| analyticsClientId        | string         | Analytics client id |
| analyticsAuthUrl         | string         | Analytics auth url |
| analyticsTokenUri        | string         | Analytics token uri |
| analyticsProviderCertUrl | string         | Analytics provider cert url |
| analyticsClientCertUrl   | string         | Analytics client cert url |
| slackWebhookUrl          | string         | Slack webhook url |
| googleapisKey            | string         | Googleapis key |
| telegramToken            | string         | Telegram bot token |

Also we have guides how to get tokens from different services, you can find it in separated docs:
* How to get analytics auth keys
* How to get googleapisKey for lighthouse
* How to get telegram token and channel id
* How to create slack webhook

### Project structure

### Developer environment setup

### Tests

### Code style
### Git commit format 
```
The commit contains the following structural elements, to communicate intent to the consumers of your library:

fix: a commit of the type fix patches a bug in your codebase (this correlates with PATCH in Semantic Versioning).
feat: a commit of the type feat introduces a new feature to the codebase (this correlates with MINOR in Semantic Versioning).
BREAKING CHANGE: a commit that has a footer BREAKING CHANGE:, or appends a ! after the type/scope, introduces a breaking API change (correlating with MAJOR in Semantic Versioning). A BREAKING CHANGE can be part of commits of any type.
types other than fix: and feat: are allowed, for example @commitlint/config-conventional (based on the the Angular convention) recommends build:, chore:, ci:, docs:, style:, refactor:, perf:, test:, and others.
footers other than BREAKING CHANGE: <description> may be provided and follow a convention similar to git trailer format.
```