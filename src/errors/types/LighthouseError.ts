export class LighthouseError extends Error{
  constructor(message:string) {
    super(`LighthouseError: ${message}`)
    this.name = 'LighthouseError'
  }

  toString(){
    return this.message
  }
}
