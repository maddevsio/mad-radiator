import axios from 'axios'
import got from 'got'
import { QuoraService } from 'quora'
import { Firestore } from "utils/firestore"

import { defaultFirestoreConfig } from '../../__tests__/fixtures/defaultRadiatorConfigs'

const responseParsedHtml: string = `<html>postsCount\\":14</html>`
const responseFireStoreData: number = 11
const expectedValue = 3

jest.mock('utils/firestore')
jest.mock('got')

// @ts-ignore
const MockedGot = got as jest.Mock<got>

jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve(responseFireStoreData))
jest.spyOn(axios, 'post').mockImplementation(
  () => new Promise<void>(res => res()),
)
const getDataAfterDate = jest
  .fn()
  .mockImplementation(() => new Promise(res => res(responseFireStoreData)))
const setData = jest.fn().mockImplementation(() => new Promise<void>(res => res()))

const MockedFirestore = Firestore as jest.Mock<Firestore>

describe('Quora service', () => {
  beforeEach(() => {
    // @ts-ignore
    MockedFirestore.mockImplementation(() => ({
      setData,
      getDataAfterDate,
    }))
    MockedGot.mockImplementation(() => Promise.resolve(responseParsedHtml))
  })
  it('should correctly return a count of quora posts', async () => {
    const posts = new QuoraService({ quoraUserID: 'Oleg-Puzanov-5' }, defaultFirestoreConfig)
    const getHtmlMock = jest.spyOn(QuoraService.prototype as any, 'getHTML');
    getHtmlMock.mockImplementation(() => new Promise(resolve => resolve(responseParsedHtml)));
    const countOfPosts = await posts.setCountOfQuoraPosts()

    expect(countOfPosts).toBe(expectedValue)
  });
})
