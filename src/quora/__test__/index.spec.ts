import axios from 'axios'
import got from 'got'
import { QuoraService } from 'quora'
import { FirestoreData } from 'quora/interfaces'
import { Firestore } from "utils/firestore"

const responseParsedHtml: string = `<html>postsCount\\":14</html>`
const responseFireStoreData: FirestoreData = {
  data: [{
    document: {
      name: 'projects/mad-radiator-e9549/databases/(default)/documents/quora/06FUTXctDClabsVXq5Ti',
      fields: {
        count: {
          integerValue: '3',
        }
      },
      createTime: '2022-06-07T14:05:49.532227Z',
      updateTime: '2022-06-07T14:10:19.836976Z'
    },
    readTime: '2022-06-08T04:55:30.242905Z'
  }]
}
const expectedValue = 11

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
    const posts = new QuoraService({ quoraUserID: 'Oleg-Puzanov-5' }, 'test')
    const getHtmlMock = jest.spyOn(QuoraService.prototype as any, 'getHTML');
    getHtmlMock.mockImplementation(() => new Promise(resolve => resolve(responseParsedHtml)));
    const countOfPosts = await posts.setCountOfQuoraPosts()

    expect(countOfPosts).toBe(expectedValue)
  });
})
