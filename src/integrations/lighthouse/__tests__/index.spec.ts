import axios from 'axios'
import getLighthouseData from 'integrations/lighthouse'
import radiatorConfigFixture from 'tests/fixtures/radiatorConfig'

jest.spyOn(axios, 'get')

describe('Radiator > lighthouse > index', () => {
  it('should correctly get raw data and return prettified data', async () => {
    jest.spyOn(axios, 'get').mockImplementation(
      () =>
        new Promise(res =>
          res({
            data: {
              lighthouseResult: {
                categories: {
                  category: {
                    id: 'category',
                    title: 'Category',
                    score: 0.55,
                  },
                },
              },
            },
          }),
        ),
    )

    const data = await getLighthouseData(radiatorConfigFixture)

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(data).toEqual({
      category: {
        title: 'Category',
        value: 55,
        rate: 'neutral',
      },
    })
  })

  it('should correctly get raw data and return prettified data with good rate', async () => {
    jest.spyOn(axios, 'get').mockImplementation(
      () =>
        new Promise(res =>
          res({
            data: {
              lighthouseResult: {
                categories: {
                  category: {
                    id: 'category',
                    title: 'Category',
                    score: 0.99,
                  },
                },
              },
            },
          }),
        ),
    )

    const data = await getLighthouseData(radiatorConfigFixture)

    expect(data).toEqual({
      category: {
        title: 'Category',
        value: 99,
        rate: 'good',
      },
    })
  })

  it('should correctly get raw data and return prettified data with bad rate', async () => {
    jest.spyOn(axios, 'get').mockImplementation(
      () =>
        new Promise(res =>
          res({
            data: {
              lighthouseResult: {
                categories: {
                  category: {
                    id: 'category',
                    title: 'Category',
                    score: 0.3,
                  },
                },
              },
            },
          }),
        ),
    )

    const data = await getLighthouseData(radiatorConfigFixture)

    expect(data).toEqual({
      category: {
        title: 'Category',
        value: 30,
        rate: 'bad',
      },
    })
  })
})
