import { capitalize } from 'utils/capitalize'

describe('capitalize utility', () => {
  it('should correctly capitalize first letter of the string', () => {
    const str = 'low'

    const result = capitalize(str)

    expect(result).toBe('Low')
  })
})
