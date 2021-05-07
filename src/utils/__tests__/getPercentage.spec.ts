import { getPercentage } from 'utils/getPercentage'

describe('getPercentage utility', () => {
  it('should correctly return percentage between two numbers with diff', () => {
    expect(getPercentage(500, 250)).toBe(100)
  })

  it('should correctly return percentage between two numbers without diff', () => {
    expect(getPercentage(500, 250, false)).toBe(200)
  })
})
