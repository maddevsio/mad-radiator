export class SearchConsoleError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SearchConsoleError'
  }

  toString() {
    return this.message
  }
}
