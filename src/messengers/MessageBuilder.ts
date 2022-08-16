import { Blog, CoreItems, Country, EbookDownloads } from 'analytics/interfaces'
import { Blocks } from 'blocks/Blocks'
import { Emoji } from 'emoji/Emoji'
import { ParsedRange, RadiatorConfig } from 'interfaces'
import { LighthouseMetrics, LighthouseUrlResult } from 'lighthouse/interfaces'
import { BuildMessageData, SlackMessageBlock } from 'messengers/interfaces'

import { ISearchConsoleData } from '../searchConsole/interfaces'
import { getMonthName } from "../utils/getMonthName";

export abstract class MessageBuilder {
  protected abstract readonly blocksService: Blocks

  protected abstract readonly emojiService: Emoji

  protected readonly config: RadiatorConfig

  private readonly fillingsContactMeGoal: number = 5

  private readonly redditPostsInMonthGoal: number = 2

  private readonly newPagesInMonthGoal: number = 2

  private readonly newQuoraPostsInMonthGoal: number = 5

  private readonly newGlassdoorReviewsGoal: number = 2

  private readonly goalsCountries: Array<string> = ['United States', 'United Kingdom', 'Germany', 'France', 'Indonesia', 'Vietnam']

  private readonly searchConsoleGoal: number = 0

  constructor(config: RadiatorConfig) {
    this.config = config
  }

  public abstract getMessage(buildMessageData: BuildMessageData): string | Array<Object>

  protected buildMessage({
    analytics,
    range,
    lighthouse,
    redditCountPosts,
    quoraPosts,
    glassdoorReviews,
    pageAnalytics,
    newPagesInSite,
    searchConsole,
  }: BuildMessageData): Array<string | SlackMessageBlock> {
    const { core, countries, blogs, contactMe, subscribers, ebookDownloads } = analytics || {}

    const message = []

    // header
    message.push(this.blocksService.header(this.headerMessage(range)))
    message.push(this.blocksService.divider())

    if (core) {
      // core section
      message.push(this.blocksService.section(this.coreMessage(core)))
      message.push(this.blocksService.section(this.coreList(core)))
      message.push(this.blocksService.divider())
    }

    if (countries) {
      // countries
      message.push(this.blocksService.section(MessageBuilder.countriesMessage()))
      message.push(this.blocksService.section(this.countriesList(countries)))
      const isGoalAchieved = countries.every(country => this.goalsCountries.includes(country.title))
      message.push(this.blocksService.section(MessageBuilder.matchGoalsCountries(isGoalAchieved, this.goalsCountries)))
      message.push(this.blocksService.divider())
    }

    if(searchConsole) {
      const isGoalAchieved = this.searchConsoleGoal === Number(searchConsole.errors)
      message.push(this.blocksService.section(MessageBuilder.searchConsoleMessage(isGoalAchieved, searchConsole)))
      message.push(this.blocksService.divider())
    }

    // blog views statistics
    if (blogs?.length) {
      message.push(this.blocksService.section(MessageBuilder.blogsMessage()))
      message.push(this.blocksService.section(this.blogsList(blogs)))
      message.push(this.blocksService.divider())
    }

    // a count of new articles in the blog
    if (pageAnalytics) {
      if (pageAnalytics.perMonth !== null || pageAnalytics.perWeek !== null) {
        message.push(this.blocksService.section(MessageBuilder.blogPostsMonthlyTitle()))

        if (pageAnalytics.perMonth !== null) {
          const isMatch = pageAnalytics.perMonth >= 4
          message.push(this.blocksService.section(MessageBuilder.blogPostsMonthlyGoalMessage(isMatch, pageAnalytics.perMonth)))
        }

        if (pageAnalytics.perWeek !== null) {
          const isMatch = pageAnalytics.perWeek >= 1
          message.push(this.blocksService.section(MessageBuilder.blogPostsWeeklyGoalMessage(isMatch, pageAnalytics.perWeek)))
        }

        message.push(this.blocksService.divider())
      }
    }

    // a count of new pages in the site
    if (newPagesInSite !== undefined) {
      message.push(this.blocksService.section(MessageBuilder.newPagesTitle()))
      const isGoalAchieved = newPagesInSite >= this.newPagesInMonthGoal
      message.push(this.blocksService.section(MessageBuilder.newPagesGoalMessage(isGoalAchieved, newPagesInSite, this.newPagesInMonthGoal)))
      message.push(this.blocksService.divider())
    }

    if (contactMe) {
      // submit contact me form
      message.push(this.blocksService.section(MessageBuilder.contactMeMessage()))
      const isGoalAchieved = contactMe.value >= this.fillingsContactMeGoal
      message.push(this.blocksService.section(MessageBuilder.contactMeMessageGoal(isGoalAchieved, contactMe.value, this.fillingsContactMeGoal)))
      message.push(this.blocksService.divider())
    }

    if (quoraPosts !== undefined) {
      message.push(this.blocksService.section(MessageBuilder.quoraTitle()))
      const isMatch = quoraPosts > this.newQuoraPostsInMonthGoal
      message.push(this.blocksService.section(MessageBuilder.quoraGoalMessage(isMatch, quoraPosts, this.newQuoraPostsInMonthGoal)))
      message.push(this.blocksService.divider())
    }

    if (redditCountPosts !== undefined) {
      message.push(this.blocksService.section(MessageBuilder.redditTitle()))
      const isGoalAchieved = redditCountPosts >= this.redditPostsInMonthGoal
      message.push(this.blocksService.section(MessageBuilder.redditGoalMessage(isGoalAchieved, redditCountPosts, this.redditPostsInMonthGoal)))
      message.push(this.blocksService.divider())
    }

    if (glassdoorReviews !== undefined) {
      message.push(this.blocksService.section(MessageBuilder.glassdoorTitle()))
      const isMatch = glassdoorReviews > this.newGlassdoorReviewsGoal
      message.push(this.blocksService.section(MessageBuilder.glassdoorGoalMessage(isMatch, glassdoorReviews, this.newGlassdoorReviewsGoal)))
      message.push(this.blocksService.divider())
    }

    if (ebookDownloads) {
      message.push(this.blocksService.section(MessageBuilder.ebookDownloadsTitle()))
      message.push(this.blocksService.section(this.ebookDownloadsList(ebookDownloads)))
      message.push(this.blocksService.divider())
    }

    if (lighthouse) {
      // pagespeed average
      message.push(
        this.blocksService.section(MessageBuilder.pagespeedAverageMessage(lighthouse.urlCount)),
      )
      message.push(this.blocksService.section(this.pagespeedList(lighthouse.average)))
      message.push(this.blocksService.divider())

      // pagespeed top
      if (lighthouse.top.length) {
        message.push(this.blocksService.section(MessageBuilder.pagespeedBestMessage()))
        message.push(this.blocksService.section(this.pagespeedRating(lighthouse.top)))
        message.push(this.blocksService.divider())
      }

      // pagespeed worst
      if (lighthouse.worst.length) {
        message.push(this.blocksService.section(MessageBuilder.pagespeedWorstMessage()))
        message.push(this.blocksService.section(this.pagespeedRating(lighthouse.worst)))
        message.push(this.blocksService.divider())
      }
    }

    if (subscribers) {
      message.push(this.blocksService.section(MessageBuilder.SubscribersMessage(subscribers.value)))
      message.push(this.blocksService.divider())
    }

    return message
  }

  private headerMessage(range: ParsedRange): string {
    return `${this.emojiService.getEmoji('calendar')} Отчет радиатора по ключевым метрикам за ${range.text}`
  }

  private coreMessage({ users, duration, sessions, bounceRate }: CoreItems): string {
    // ${integration === Integration.slack ? '<!here>' : ''}
    return `За отчетный период сайт ${this.config.websiteUrl} посетило *${users.value} пользователей*. Всего *${sessions.value} сессий*, средняя длительность 1 сессии составляет *${duration.value}*. *${bounceRate.value}%* пользователей закрыли сайт никак с ним не провзаимодействовав.`
  }

  private coreList({ users, weeklyUsers, monthlyUsers, duration, sessions, bounceRate }: CoreItems) {
    return this.blocksService.list([
      this.blocksService.listItem(users, {
        title: 'Users',
        emojiType: 'man',
        parensKey: 'difference',
        valueType: '',
        parensType: '%',
      }),
      this.blocksService.listItem(sessions, {
        title: 'Sessions',
        emojiType: 'door',
        parensKey: 'difference',
        valueType: '',
        parensType: '%',
      }),
      this.blocksService.listItem(bounceRate, {
        title: 'Bounce Rate',
        emojiType: 'moyai',
        parensKey: 'difference',
        valueType: '%',
        parensType: '%',
      }),
      this.blocksService.listItem(duration, {
        title: 'Session Duration',
        emojiType: 'clock1',
        parensKey: 'difference',
        valueType: '',
        parensType: '%',
      }),
      this.blocksService.totalListItem(weeklyUsers, {
        title: 'Пользователей за последние 7 дней',
        total: 3000,
        emojiType: weeklyUsers.value > 3000 ? 'white_check_mark' : 'x',
      }),
      this.blocksService.totalListItem(monthlyUsers, {
        title: 'Пользователей за последние 28 дней',
        total: 11000,
        emojiType: monthlyUsers.value > 11000 ? 'white_check_mark' : 'x',
      }),
    ])
  }

  private static countriesMessage() {
    return '*Топ-3 страны, в которых находятся пользователи, посетившие сайт:*'
  }

  private countriesList(countries: Array<Country>) {
    return this.blocksService.list(
      countries.map(country => this.blocksService.countryListItem(country)),
    )
  }

  private static matchGoalsCountries(isGoalAchieved: boolean, goalsCountries: Array<string>) {
    return `${isGoalAchieved ? ':white_check_mark:' : ':x:'} Should be -> ${goalsCountries.join(', ')}`
  }

  private static contactMeMessage() {
    return '*Заполнения формы contact me:*'
  }

  private static ebookDownloadsTitle() {
    return `*Количество скачиваний Ebook'ов за последние 30 дней:*`
  }

  private ebookDownloadsList(ebookDownloads: Array<EbookDownloads>) {
    return this.blocksService.list(
      ebookDownloads.map(ebookDownload => this.blocksService.ebookDownloadsListItem(ebookDownload)),
    )
  }

  private static contactMeMessageGoal(isGoalAchieved: boolean, contactMeValue: number, goal: number) {
    return `${isGoalAchieved ? ':white_check_mark:' : ':x:'} Заполнения за последние 30 дней: ${contactMeValue} / Should be > ${goal}`
  }

  private static quoraTitle() {
    return '*Количество новых постов на Quora:*'
  }

  private static glassdoorTitle() {
    return '*Количество новых отзывов на Glassdoor:*'
  }

  private static quoraGoalMessage(isMath: boolean, quoraCount: number, goal: number) {
    return `${isMath ? ':white_check_mark:' : ':x:'} Новых статей за ${getMonthName()}: ${quoraCount} / Should be -> ${goal}`
  }

  private static glassdoorGoalMessage(isMath: boolean, glassdoorCount: number, goal: number) {
    return `${isMath ? ':white_check_mark:' : ':x:'} Новых отзывов за ${getMonthName()}: ${glassdoorCount} / Should be -> ${goal}`
  }

  private static redditTitle() {
    return '*Количество новых постов на Reddit:*'
  }

  private static redditGoalMessage(isGoalAchieved: boolean, redditCount: number, goal: number) {
    return `${isGoalAchieved ? ':white_check_mark:' : ':x:'} Новых статей за ${getMonthName()}: ${redditCount} / Should be -> ${goal}`
  }

  private static newPagesTitle() {
    return '*Количество новых страниц на сайте:*'
  }

  private static newPagesGoalMessage(isGoalAchieved: boolean, pagesCount: number, goal: number) {
    return `${isGoalAchieved ? ':white_check_mark:' : ':x:'} Новых страниц за ${getMonthName()}: ${pagesCount} / Should be -> ${goal}`
  }

  private static blogPostsMonthlyTitle() {
    return '*Количество новых статей в блоге:*'
  }

  private static blogPostsMonthlyGoalMessage(isMatch: boolean, blogPostCount: number) {
    return `${isMatch ? ':white_check_mark:' : ':x:'} Новых статей за ${getMonthName()}: ${blogPostCount} / Should be > 4`
  }

  private static blogPostsWeeklyGoalMessage(isMatch: boolean, blogPostCount: number) {
    return `${isMatch ? ':white_check_mark:' : ':x:'} Новых статей за неделю: ${blogPostCount} / Should be > 1`
  }

  private static pagespeedAverageMessage(count: number) {
    return `Средняя производительность сайта от Google PageSpeed(Проанализировано ${count} страниц):`
  }

  private pagespeedList(lighthouse: LighthouseMetrics) {
    return this.blocksService.list([
      this.blocksService.performanceListItem(
        'Performance',
        lighthouse.performance,
        'chart_with_upwards_trend',
      ),
      this.blocksService.performanceListItem(
        'Accessibility',
        lighthouse.accessibility,
        'wheelchair',
      ),
      this.blocksService.performanceListItem(
        'Best Practices',
        lighthouse.best_practices,
        'the_horns',
      ),
      this.blocksService.performanceListItem('SEO', lighthouse.seo, 'sports_medal'),
      this.blocksService.performanceListItem('PWA', lighthouse.pwa, 'iphone'),
    ])
  }

  private static pagespeedBestMessage() {
    return 'Лучшие страницы:'
  }

  private static pagespeedWorstMessage() {
    return 'Худшие страницы:'
  }

  private pagespeedRating(urls: Array<LighthouseUrlResult>) {
    return this.blocksService.list(
      urls.map(urlResult => this.blocksService.pagespeedRatingListItem(urlResult)),
    )
  }

  private static blogsMessage() {
    return '*Топ-3 популярных статей в блоге:*'
  }

  private blogsList(blogs: Array<Blog>) {
    return this.blocksService.list(
      blogs.map(blog => this.blocksService.blogListItem(blog)),
    )
  }

  private static SubscribersMessage(subscribeCount: number) {
    return `:newspaper: *Подписки на рассылку за последние 28 дней:* ${subscribeCount}`
  }

  private static searchConsoleMessage(isMatch: boolean, searchConsole: ISearchConsoleData) {
    return `*Search Console:*\n\n${isMatch ? ':white_check_mark:' : ':x:'} Coverage-Excluded pages: ${searchConsole.errors} /  Should be -> 0 ${!isMatch ? '<https://search.google.com/search-console/index?resource_id=sc-domain%3Amaddevs.io&hl=en|view errors>' : ''}`
  }
}
