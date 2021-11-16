import { RunCounter } from '../RunCounter'

describe('Run counter', () => {
  it('should correctly increment run count', () => {
    const runCounter = new RunCounter()
    runCounter.incrementRunCounter()
    runCounter.incrementRunCounter()

    expect(runCounter.getRunCounter()).toBe(2)
  })

  it('should correctly reset run count', () => {
    const runCounter = new RunCounter()
    runCounter.incrementRunCounter()
    runCounter.resetRunCounter()

    expect(runCounter.getRunCounter()).toBe(0)
  })
})
