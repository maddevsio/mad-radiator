export class GlassdoorError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GlassdoorError'
  }

  toString() {
    return this.message
  }
}
