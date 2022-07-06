// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Reddit from 'reddit'
import { RedditCountPosts } from 'redditPosts/RedditCountPosts'

jest.mock('reddit')

const mockConfig = {
    "redditClientId": "test",
    "redditClientSecret": "test",
    "redditUsername": "test",
    "redditPassword": "test"
}

const MockedReddit = Reddit as jest.Mock<Reddit>

describe('RedditCountPosts service', () => {
    beforeEach(() => {
        MockedReddit.mockImplementation(() => ({
            get: jest.fn().mockReturnValueOnce({
                data: {
                    children: [
                        {
                            data: {
                                title: 'Test 1',
                                created_utc: 1556004744
                            },
                        },
                    ],
                    after: 'test'
                },
            }).mockReturnValueOnce({
                data: {
                    children: [
                        {
                            data: {
                                title: 'Test 1',
                                created_utc: 1654064430
                            },
                        },
                        {
                            data: {
                                title: 'Test 1',
                                created_utc: 1654064430
                            },
                        },
                    ],
                    after: null
                },
            })
        }))
    })

    afterEach(() => {
        jest.resetAllMocks()
    })
    it('should correctly return reddit posts count', async () => {
        const reddit = new RedditCountPosts(mockConfig)
        const redditCount = await reddit.getPostsCountInReddit()
        expect(redditCount).toBe(0)
    })
})
