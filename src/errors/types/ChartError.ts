export class ChartError extends Error{
  constructor(message:string) {
    super(`ChartError: ${message}`)
    this.name = 'ChartError'
  }

  toString(){
    return this.message
  }
}
