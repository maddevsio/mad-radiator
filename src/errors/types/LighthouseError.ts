export class LighthouseError extends Error{
  constructor(message:string) {
    super(message)
    this.name = 'LighthouseError'
  }

  toString(){
    return this.message
  }
}
