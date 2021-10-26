import emoji from 'node-emoji'

export type EmojiType = keyof typeof emoji.emoji | string
