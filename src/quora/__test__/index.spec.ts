import axios from 'axios'
import { QuoraService } from 'quora'
import { Firestore } from 'utils/firestore'

import { defaultFirestoreConfig } from '../../__tests__/fixtures/defaultRadiatorConfigs'

const responseFireStoreData: number = 4
const expectedValue = 6

jest.mock('utils/firestore')

jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve(responseFireStoreData))
jest.spyOn(axios, 'post').mockImplementation(() => new Promise<void>(res => res()))
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
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should correctly return a count of quora posts', async () => {
    const posts = new QuoraService({ quoraUserID: 'Oleg-Puzanov-5' }, defaultFirestoreConfig)
    const getHtmlMock = jest.spyOn(QuoraService.prototype as any, 'parseHTML')
    getHtmlMock.mockImplementation(() => new Promise(resolve => resolve(10)))
    const countOfPosts = await posts.setCountOfQuoraPosts()

    expect(countOfPosts).toBe(expectedValue)
  })
})
