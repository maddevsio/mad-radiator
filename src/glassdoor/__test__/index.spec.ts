import axios from 'axios'
import { GlassdoorError } from 'errors/types/GlassdoorError'
import { GlassdoorService } from 'glassdoor/GlassdoorService'
import { Firestore } from 'utils/firestore'

import { defaultFirestoreConfig } from '../../__tests__/fixtures/defaultRadiatorConfigs'

const responseFireStoreData: number = 10
const expectedValue = 12

jest.mock('utils/firestore')
jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve(responseFireStoreData))
jest.spyOn(axios, 'post').mockImplementation(
  () => new Promise<void>(res => res()),
)

const getDataAfterDate = jest
  .fn()
  .mockImplementation(() => new Promise(res => res(responseFireStoreData)))
const setData = jest.fn().mockImplementation(() => new Promise<void>(res => res()))

const MockedFirestore = Firestore as jest.Mock<Firestore>

describe('Glassdoor service', () => {
  beforeEach(() => {
    // @ts-ignore
    MockedFirestore.mockImplementation(() => ({
      setData,
      getDataAfterDate,
    }))
  })

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should correctly return a count of glassdoor reviews', async () => {
    const posts = new GlassdoorService({ api_key: 'api_key', glassdoorUrl: 'url' }, defaultFirestoreConfig)
    const getHtmlMock = jest.spyOn(GlassdoorService.prototype as any, 'getReviewsFromGlassdoor');
    getHtmlMock.mockImplementation(() => new Promise(resolve => resolve(22)));
    const countOfPosts = await posts.setCountOfGlassdoorReviews()

    expect(countOfPosts).toBe(expectedValue)
  });

  it('should correctly throw GlassdoorError', async () => {
    const error = () => {
      throw new GlassdoorError('authorization error')
    }
    expect(error).toThrow(GlassdoorError)
  })
})
