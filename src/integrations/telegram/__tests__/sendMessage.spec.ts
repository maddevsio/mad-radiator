import axios from 'axios'
import { sendMessage } from 'integrations/telegram/sendMessage'
import radiatorConfigFixture from 'tests/fixtures/radiatorConfig'

describe('Radiator > telegram > sendMessage', () => {
  it('should correctly called axios', async () => {
    jest.spyOn(axios, 'post').mockImplementation(() => new Promise(res => res(null)))

    await sendMessage('message', radiatorConfigFixture)

    expect(axios.post).toHaveBeenCalledTimes(1)
  })
})
