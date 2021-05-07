import { fromISO } from 'utils/countryISO/fromISO'

describe('fromISO utility', () => {
  it('should correctly return country', () => {
    const code = fromISO('ru')
    expect(code).toBe('Russia')
  })

  it('should correctly return null if country is not in list', () => {
    const code = fromISO('bad')
    expect(code).toBeNull()
  })
})
