export class ChartError extends Error{
  constructor(message:string) {
    super(message)
    this.name = 'ChartError'
  }

  toString(){
    return this.message
  }
}
