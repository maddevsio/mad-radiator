import { Readable } from 'stream'

export abstract class Storage {
  public abstract storeFile(image: Buffer): Promise<string | undefined>

  protected createReadStream(buffer: Buffer) {
    const stream = new Readable()
    stream.push(buffer)
    stream.push(null)
    return stream
  }
}
