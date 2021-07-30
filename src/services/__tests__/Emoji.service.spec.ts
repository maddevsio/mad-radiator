import { EmojiService } from 'emoji/EmojiFactory'
import { Integration } from 'enums'
import { Emoji } from 'interfaces'

describe('EmojiService', () => {
  it('should correctly return an instance', () => {
    const service = new EmojiService(Integration.slack)

    expect(service.setType).toBeTruthy()
    expect(service.getEmoji).toBeTruthy()
    expect(service.getRateEmoji).toBeTruthy()
    expect(service.getEmojiNameForDevice).toBeTruthy()
  })

  it('getEmoji correctly return emoji for different integrations', () => {
    const slackService = new EmojiService(Integration.slack)
    const tgService = new EmojiService(Integration.telegram)

    const slackEmoji = slackService.getEmoji('+1')
    const tgEmoji = tgService.getEmoji('+1')

    expect(slackEmoji).toBe(':thumbsup:')
    expect(tgEmoji).toBe('👍')
  })

  it('getEmoji correctly return x emoji for undefined emoji', () => {
    const slackService = new EmojiService(Integration.slack)

    const slackEmoji = slackService.getEmoji('undef_emoji' as Emoji)

    expect(slackEmoji).toBe(':x:')
  })

  it('getRateEmoji correctly return emoji for different integrations', () => {
    const slackService = new EmojiService(Integration.slack)

    const slackEmoji = slackService.getRateEmoji()

    expect(slackEmoji).toBe(':neutral_face:')
  })

  it('getEmojiNameForDevice correctly return emoji name for different integrations', () => {
    const slackService = new EmojiService(Integration.slack)

    const emoji = slackService.getEmojiNameForDevice('mobile')

    expect(emoji).toBe('iphone')
  })

  it('setType correctly switch integration', () => {
    const service = new EmojiService(Integration.slack)

    const slackEmoji = service.getEmoji('+1')
    service.setType(Integration.telegram)
    const tgEmoji = service.getEmoji('+1')

    expect(slackEmoji === tgEmoji).toBeFalsy()
  })
})
