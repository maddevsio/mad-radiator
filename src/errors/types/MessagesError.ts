export class MessagesError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MessagesError'
  }

  toString() {
    return this.message
  }
}
