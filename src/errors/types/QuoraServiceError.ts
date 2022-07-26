export class QuoraServiceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'QuoraServiceError'
  }

  toString() {
    return this.message
  }
}
