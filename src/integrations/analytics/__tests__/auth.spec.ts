import fs from 'fs'

import { google } from 'googleapis'
import { authorize } from 'integrations/analytics/auth'
import radiatorConfigFixture from 'tests/fixtures/radiatorConfig'

jest.spyOn(fs, 'writeFile').mockImplementation(() => null)
jest.spyOn(fs, 'unlink').mockImplementation(() => null)

jest.mock('googleapis', () => ({
  google: {
    auth: {
      GoogleAuth: jest.fn(),
    },
    options: jest.fn(),
  },
}))

describe('Radiator > analytics > auth module', () => {
  it('should correctly called google auth functions', async () => {
    const unlink = await authorize(radiatorConfigFixture)
    expect(fs.writeFile).toHaveBeenCalledTimes(1)
    expect(google.auth.GoogleAuth).toHaveBeenCalledTimes(1)
    expect(google.options).toHaveBeenCalledTimes(1)
    await unlink()
    expect(fs.unlink).toHaveBeenCalledTimes(1)
  })

  it('should correctly throw and log error during writeFile', async () => {
    jest
      .spyOn(fs, 'writeFile')
      .mockImplementation(
        (_, __,
          callback: fs.NoParamCallback,
        ) => callback(new Error('Error')),
      )
    jest.spyOn(global.console, 'error').mockImplementation(() => null)

    await authorize(radiatorConfigFixture)

    expect(global.console.error).toHaveBeenCalledWith(new Error('Error'))
  })

  it('should correctly throw and log error during unlink', async () => {
    jest.spyOn(fs, 'writeFile').mockImplementation(() => null)
    jest
      .spyOn(fs, 'unlink')
      .mockImplementation((_, callback: fs.NoParamCallback) =>
        callback(new Error('Error')),
      )
    jest.spyOn(global.console, 'error').mockImplementation(() => null)
    const unlink = await authorize(radiatorConfigFixture)

    await unlink()

    expect(global.console.error).toHaveBeenCalledWith(new Error('Error'))
  })
})
