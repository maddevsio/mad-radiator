export class StorageError extends Error{
  constructor(message:string) {
    super(`StorageError: ${message}`)
    this.name = 'StorageError'
  }

  toString(){
    return this.message
  }
}
