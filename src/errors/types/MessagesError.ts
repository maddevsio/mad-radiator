export class MessagesError extends Error{
  constructor(message:string) {
    super(`MessagesError: ${message}`)
    this.name = 'MessagesError'
  }

  toString(){
    return this.message
  }
}
