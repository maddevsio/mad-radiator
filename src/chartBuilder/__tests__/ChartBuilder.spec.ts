import { ChartBuilder } from 'chartBuilder/ChartBuilder'

describe('ChartBuilder', () => {
  it('should correctly create an instance', () => {
    const builder = new ChartBuilder()

    expect(builder.renderChart).toBeTruthy()
  })
})
