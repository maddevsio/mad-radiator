import { Country, Device } from 'analytics/interfaces'
import { SlackBlocks } from 'blocks/SlackBlocks'
import { Rate } from 'interfaces'
import { LighthouseEntity } from 'lighthouse/interfaces'
import { SlackMessageBlockType } from 'messengers/interfaces'

describe('SlackBlocks', () => {
  it('should correctly return an instance', () => {
    const blocks = new SlackBlocks()

    expect(blocks.countryListItem).toBeTruthy()
    expect(blocks.list).toBeTruthy()
    expect(blocks.listItem).toBeTruthy()
    expect(blocks.performanceListItem).toBeTruthy()
    expect(blocks.section).toBeTruthy()
    expect(blocks.divider).toBeTruthy()
    expect(blocks.header).toBeTruthy()
  })

  it('countryListItem should correctly return markup', () => {
    const blocks = new SlackBlocks()

    const country: Country = {
      title: 'Russia',
      percentage: 30,
      rate: Rate.good,
      value: 125,
    }

    const countryListItem = blocks.countryListItem(country)

    expect(countryListItem).toBe(':flag-ru: Russia: *30%* от всех посетителей сайта')
  })

  it('countryListItem correctly returns markup with undefined country', () => {
    const blocks = new SlackBlocks()

    const country: Country = {
      title: 'undef_country',
      percentage: 30,
      rate: Rate.good,
      value: 125,
    }

    const countryListItem = blocks.countryListItem(country)

    expect(countryListItem).toBe(':flags: undef_country: *30%* от всех посетителей сайта')
  })

  it('list correctly returns markup', () => {
    const listItems = ['hello', 'world']

    const blocks = new SlackBlocks()
    const listItem = blocks.list(listItems)

    expect(listItem).toBe('hello\n\nworld')
  })

  it('listItem correctly returns markup', () => {
    const device: Device = {
      title: 'mobile',
      value: 40,
      previous: 30,
      rate: Rate.good,
      difference: '10%',
    }

    const service = new SlackBlocks()
    const listItem = service.listItem(device, {
      title: 'TITLE',
      emojiType: '+1',
      parensKey: 'difference',
    })

    expect(listItem).toBe(':yum: :thumbsup: TITLE: *40* (10%)')
  })

  it('performanceListItem correctly returns markup', () => {
    const entity: LighthouseEntity = {
      title: 'Speed',
      value: 90,
      rate: Rate.good,
    }

    const service = new SlackBlocks()
    const listItem = service.performanceListItem(entity, '+1')

    expect(listItem).toBe(':yum: :thumbsup: Speed: *90%*')
  })

  it('section correctly returns markup', () => {
    const str = 'Some str'

    const service = new SlackBlocks()
    const section = service.section(str)

    expect(section).toEqual({
      type: SlackMessageBlockType.section,
      text: {
        type: 'mrkdwn',
        text: `Some str\n\n`,
      },
    })
  })

  it('divider correctly returns markup', () => {
    const service = new SlackBlocks()

    const divider = service.divider()

    expect(divider).toEqual({
      type: SlackMessageBlockType.divider,
    })
  })

  it('header correctly returns markup', () => {
    const title = 'Some title'

    const service = new SlackBlocks()
    const header = service.header(title)

    expect(header).toEqual({
      type: SlackMessageBlockType.header,
      text: {
        type: 'plain_text',
        emoji: true,
        text: 'Some title',
      },
    })
  })

  it('image correctly returns markup', () => {
    const url = 'url'

    const service = new SlackBlocks()

    const image = service.image(url)
    const empty = service.image()
    const divider = service.divider()

    expect(empty).toEqual(divider)
    expect(image).toEqual({
      type: SlackMessageBlockType.image,
      image_url: 'url',
      alt_text: 'Graph',
    })
  })
})
