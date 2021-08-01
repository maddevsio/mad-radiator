import { EmojiType } from 'emoji/interfaces'

export interface ListItemParameters {
  title: string
  emojiType: EmojiType
  parensKey: 'difference' | 'previous'
  valueType?: string
  parensType?: string
}
