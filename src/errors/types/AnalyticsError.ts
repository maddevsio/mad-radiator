export class AnalyticsError extends Error{
  constructor(message:string) {
    super(`AnalyticsError: ${message}`)
    this.name = 'AnalyticsError'
  }

  toString(){
    return this.message
  }
}
