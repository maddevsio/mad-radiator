import { ChartBuilder } from 'chartBuilder/ChartBuilder'

jest.mock('chartjs-node-canvas', () => ({
  ChartJSNodeCanvas: class {
    renderToBufferSync = jest.fn()

    constructor({ chartCallback }: { chartCallback: (ChartJS: unknown) => void }) {
      chartCallback({ defaults: { font: {} } })
    }
  },
}))
jest.mock('sharp', () => () => ({
  png: () => ({
    toBuffer: () => 'buffer',
  }),
}))

describe('ChartBuilder', () => {
  it('should correctly create an instance', () => {
    const builder = new ChartBuilder()

    expect(builder.renderChart).toBeTruthy()
  })

  it('should correctly called renderChart method and got png', async () => {
    const builder = new ChartBuilder()
    const img = await builder.renderChart({ test: 1, test2: 2 })

    expect(img).toBe('buffer')
  })
})
