import { ChartService } from 'services/Chart.service'

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

describe('ChartService', () => {
  it('should correctly create an instance', () => {
    const service = new ChartService()

    expect(service.renderChart).toBeTruthy()
  })

  it('should correctly called renderChart method and got png', async () => {
    const service = new ChartService()
    const img = await service.renderChart({ test: 1, test2: 2 })

    expect(img).toBe('buffer')
  })
})
