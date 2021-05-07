import axios from 'axios'
import { sendMessage } from 'integrations/slack/sendMessage'
import radiatorConfigFixture from 'tests/fixtures/radiatorConfig'

describe('Radiator > slack > sendMessage', () => {
  it('should correctly called axios', async () => {
    jest.spyOn(axios, 'post').mockImplementation(() => new Promise(res => res(null)))

    await sendMessage({}, radiatorConfigFixture)

    expect(axios.post).toHaveBeenCalledTimes(1)
  })
})
