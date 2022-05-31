import { EmojiType } from 'emoji/interfaces'

export interface ListItemParameters {
  title: string
  emojiType: EmojiType
  total?: number
  parensKey?: 'difference' | 'previous'
  valueType?: string
  parensType?: string
}
