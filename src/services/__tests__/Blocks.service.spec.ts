import { Integration, Rate, SlackMessageBlockType } from 'enums'
import { Country, Device } from 'interfaces/analytics'
import { LighthouseEntity } from 'interfaces/lighthouse'
import { BlocksService } from 'services/Blocks.service'
import { EmojiService } from 'services/Emoji.service'

describe('BlocksService', () => {
  it('should correctly return an instance', () => {
    const emojiService = new EmojiService(Integration.slack)
    const service = new BlocksService(Integration.slack, emojiService)

    expect(service.setType).toBeTruthy()
    expect(service.countryListItem).toBeTruthy()
    expect(service.list).toBeTruthy()
    expect(service.listItem).toBeTruthy()
    expect(service.performanceListItem).toBeTruthy()
    expect(service.section).toBeTruthy()
    expect(service.divider).toBeTruthy()
    expect(service.header).toBeTruthy()
  })

  it('countryListItem correctly returns markup', () => {
    const service = new BlocksService(Integration.slack)

    const country: Country = {
      title: 'Russia',
      percentage: 30,
      rate: Rate.good,
      value: 125,
    }

    const countryListItem = service.countryListItem(country)

    expect(countryListItem).toBe(':flag-ru: Russia: *30%* от всех посетителей сайта')
  })

  it('countryListItem correctly returns markup with undefined country', () => {
    const service = new BlocksService(Integration.slack)

    const country: Country = {
      title: 'undef_country',
      percentage: 30,
      rate: Rate.good,
      value: 125,
    }

    const countryListItem = service.countryListItem(country)

    expect(countryListItem).toBe(':flags: undef_country: *30%* от всех посетителей сайта')
  })

  it('list correctly returns markup', () => {
    const slackService = new BlocksService(Integration.slack)
    const tgService = new BlocksService(Integration.telegram)

    const listItems = ['hello', 'world']

    const slackCountryListItem = slackService.list(listItems)
    const tgCountryListItem = tgService.list(listItems)

    expect(slackCountryListItem).toBe('hello\n\nworld')
    expect(tgCountryListItem).toBe('hello\nworld')
  })

  it('listItem correctly returns markup', () => {
    const service = new BlocksService(Integration.slack)

    const device: Device = {
      title: 'mobile',
      value: 40,
      previous: 30,
      rate: Rate.good,
      difference: '10%',
    }

    const listItem = service.listItem(device, 'TITLE', '+1', 'difference')

    expect(listItem).toBe(':yum: :thumbsup: TITLE: *40* (10%)')
  })

  it('performanceListItem correctly returns markup', () => {
    const service = new BlocksService(Integration.slack)

    const entity: LighthouseEntity = {
      title: 'Speed',
      value: 90,
      rate: Rate.good,
    }

    const listItem = service.performanceListItem(entity, '+1')

    expect(listItem).toBe(':yum: :thumbsup: Speed: *90%*')
  })

  it('section correctly returns markup', () => {
    const slackService = new BlocksService(Integration.slack)
    const tgService = new BlocksService(Integration.telegram)

    const str = 'Some str'

    const slackSection = slackService.section(str)
    const tgSection = tgService.section(str)

    expect(slackSection).toEqual({
      type: SlackMessageBlockType.section,
      text: {
        type: 'mrkdwn',
        text: `Some str\n\n`,
      },
    })
    expect(tgSection).toBe('Some str\n\n')
  })

  it('divider correctly returns markup', () => {
    const slackService = new BlocksService(Integration.slack)
    const tgService = new BlocksService(Integration.telegram)

    const slackDivider = slackService.divider()
    const tgDivider = tgService.divider()

    expect(slackDivider).toEqual({
      type: SlackMessageBlockType.divider,
    })
    expect(tgDivider).toBe('———\n')
  })

  it('header correctly returns markup', () => {
    const slackService = new BlocksService(Integration.slack)
    const tgService = new BlocksService(Integration.telegram)

    const title = 'Some title'

    const slackHeader = slackService.header(title)
    const tgHeader = tgService.header(title)

    expect(slackHeader).toEqual({
      type: SlackMessageBlockType.header,
      text: {
        type: 'plain_text',
        emoji: true,
        text: 'Some title',
      },
    })
    expect(tgHeader).toBe('*Some title*\n')
  })

  it('image correctly returns markup', () => {
    const slackService = new BlocksService(Integration.slack)
    const tgService = new BlocksService(Integration.telegram)

    const url = 'url'

    const slackImage = slackService.image(url)
    const tgImage = tgService.image(url)
    const empty = slackService.image()
    const divider = slackService.divider()

    expect(empty).toEqual(divider)

    expect(slackImage).toEqual({
      type: SlackMessageBlockType.image,
      image_url: 'url',
      alt_text: 'Graph',
    })
    expect(tgImage).toBe('Chart: url\n\n')
  })

  it('setType correctly switch integration', () => {
    const service = new BlocksService(Integration.slack)

    const slackDivider = service.divider()
    service.setType(Integration.telegram)
    const tgDivider = service.divider()

    expect(slackDivider === tgDivider).toBeFalsy()
  })
})
