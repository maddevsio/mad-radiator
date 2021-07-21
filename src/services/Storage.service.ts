import { Readable } from 'stream'

import { drive_v3, google } from 'googleapis'

export class StorageService {
  private readonly drive: drive_v3.Drive

  private static mimeType = 'image/png'

  constructor() {
    this.drive = google.drive({
      version: 'v3',
    })
  }

  public async storeFile(image: Buffer) {
    const stream = this.createReadStream(image)

    const {
      data: { id },
    } = await this.drive.files.create({
      requestBody: {
        name: `${new Date().toDateString()}.png`,
        mimeType: StorageService.mimeType,
      },
      media: {
        mimeType: StorageService.mimeType,
        body: stream,
      },
    })

    await this.drive.permissions.create({
      fileId: id || undefined,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    })

    return id ? this.buildPreviewLink(id) : undefined
  }

  private buildPreviewLink(id: string) {
    return `https://drive.google.com/uc?export=view&id=${id}`
  }

  private createReadStream(buffer: Buffer) {
    const stream = new Readable()
    stream.push(buffer)
    stream.push(null)
    return stream
  }
}
