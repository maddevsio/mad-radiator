import { Readable } from 'stream'

import { google } from 'googleapis'
import { Storage } from 'storage/Storage'

import { StorageError } from '../errors/types/StorageError'

export class GoogleDriveStorage extends Storage {
  private readonly drive = google.drive({
    version: 'v3',
  })

  private static mimeType = 'image/png'

  public async storeFile(image: Buffer) {
    try {
      const stream = this.createReadStream(image)

      const {
        data: { id },
      } = await this.drive.files.create(GoogleDriveStorage.getCreateRequestParams(stream))

      await this.drive.permissions.create(GoogleDriveStorage.getPermissionsRequestParams(id))

      return id ? GoogleDriveStorage.buildPreviewLink(id) : undefined
    } catch (error) {
      throw new StorageError(error)
    }
  }

  private static getPermissionsRequestParams(id: string | null | undefined) {
    return {
      fileId: id || undefined,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    }
  }

  private static getCreateRequestParams(stream: Readable) {
    return {
      requestBody: {
        name: `${new Date().toDateString()}.png`,
        mimeType: GoogleDriveStorage.mimeType,
      },
      media: {
        mimeType: GoogleDriveStorage.mimeType,
        body: stream,
      },
    }
  }

  private static buildPreviewLink(id: string) {
    return `https://drive.google.com/uc?export=view&id=${id}`
  }
}
