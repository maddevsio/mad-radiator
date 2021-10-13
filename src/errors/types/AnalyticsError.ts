export class AnalyticsError extends Error{
  constructor(message:string) {
    super(message)
    this.name = 'AnalyticsError'
  }

  toString(){
    return this.message
  }
}
