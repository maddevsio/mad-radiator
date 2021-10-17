export class StorageError extends Error{
  constructor(message:string) {
    super(message)
    this.name = 'StorageError'
  }

  toString(){
    return this.message
  }
}
