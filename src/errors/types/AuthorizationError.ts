export class AuthorizationError extends Error{
  constructor(message:string) {
    super(`AuthorizationError: ${message}`)
    this.name = 'AuthorizationError'
  }

  toString(){
    return this.message
  }
}
