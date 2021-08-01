import { Country, Device } from 'analytics/interfaces'
import { TelegramBlocks } from 'blocks/TelegramBlocks'
import { Rate } from 'interfaces'
import { LighthouseEntity } from 'lighthouse/interfaces'

describe('TelegramBlocks', () => {
  it('should correctly return an instance', () => {
    const blocks = new TelegramBlocks()

    expect(blocks.countryListItem).toBeTruthy()
    expect(blocks.list).toBeTruthy()
    expect(blocks.listItem).toBeTruthy()
    expect(blocks.performanceListItem).toBeTruthy()
    expect(blocks.section).toBeTruthy()
    expect(blocks.divider).toBeTruthy()
    expect(blocks.header).toBeTruthy()
  })

  it('countryListItem should correctly return markup', () => {
    const blocks = new TelegramBlocks()

    const country: Country = {
      title: 'Russia',
      percentage: 30,
      rate: Rate.good,
      value: 125,
    }

    const countryListItem = blocks.countryListItem(country)

    expect(countryListItem).toBe('🇷🇺 Russia: *30%* от всех посетителей сайта')
  })

  it('countryListItem correctly returns markup with undefined country', () => {
    const blocks = new TelegramBlocks()

    const country: Country = {
      title: 'undef_country',
      percentage: 30,
      rate: Rate.good,
      value: 125,
    }

    const countryListItem = blocks.countryListItem(country)

    expect(countryListItem).toBe('🎏 undef_country: *30%* от всех посетителей сайта')
  })

  it('list correctly returns markup', () => {
    const listItems = ['hello', 'world']

    const blocks = new TelegramBlocks()
    const listItem = blocks.list(listItems)

    expect(listItem).toBe('hello\nworld')
  })

  it('listItem correctly returns markup', () => {
    const device: Device = {
      title: 'mobile',
      value: 40,
      previous: 30,
      rate: Rate.good,
      difference: '10%',
    }

    const service = new TelegramBlocks()
    const listItem = service.listItem(device, {
      title: 'TITLE',
      emojiType: '+1',
      parensKey: 'difference',
    })

    expect(listItem).toBe('😋 👍 TITLE: *40* (10%)')
  })

  it('performanceListItem correctly returns markup', () => {
    const entity: LighthouseEntity = {
      title: 'Speed',
      value: 90,
      rate: Rate.good,
    }

    const service = new TelegramBlocks()
    const listItem = service.performanceListItem(entity, '+1')

    expect(listItem).toBe('😋 👍 Speed: *90%*')
  })

  it('section correctly returns markup', () => {
    const str = 'Some str'

    const service = new TelegramBlocks()
    const section = service.section(str)

    expect(section).toBe('Some str\n\n')
  })

  it('divider correctly returns markup', () => {
    const service = new TelegramBlocks()

    const divider = service.divider()

    expect(divider).toBe('———\n')
  })

  it('header correctly returns markup', () => {
    const title = 'Some title'

    const service = new TelegramBlocks()
    const header = service.header(title)

    expect(header).toBe('*Some title*\n')
  })

  it('image correctly returns markup', () => {
    const url = 'url'

    const service = new TelegramBlocks()

    const image = service.image(url)
    const empty = service.image()
    const divider = service.divider()

    expect(empty).toEqual(divider)
    expect(image).toEqual('Chart: url\n\n')
  })
})
