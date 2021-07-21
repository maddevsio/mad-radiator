import { ChartConfiguration } from 'chart.js'
import { ChartJSNodeCanvas, ChartJSNodeCanvasOptions } from 'chartjs-node-canvas'
import sharp from 'sharp'

const DEFAULT_COLOR = '#ec1c24'

// @ts-ignore
const chartCallback = ChartJS => {
  // eslint-disable-next-line
  ChartJS.defaults.backgroundColor = DEFAULT_COLOR
  // eslint-disable-next-line
  ChartJS.defaults.color = DEFAULT_COLOR
  // eslint-disable-next-line
  ChartJS.defaults.font.size = 20
  // eslint-disable-next-line
  ChartJS.defaults.font.weight = 'bold'
}

export class ChartService {
  private readonly renderService: ChartJSNodeCanvas

  private static chartOptions: ChartJSNodeCanvasOptions = {
    width: 1920,
    height: 1080,
    type: 'svg',
    chartCallback,
  }

  constructor() {
    this.renderService = new ChartJSNodeCanvas(ChartService.chartOptions)
  }

  public async renderChart(chartData: Record<string, number>) {
    const params: ChartConfiguration = {
      type: 'line',
      data: {
        labels: Object.keys(chartData),
        datasets: [
          {
            label: 'Users',
            data: Object.values(chartData),
            backgroundColor: [DEFAULT_COLOR],
            borderColor: [DEFAULT_COLOR],
            borderWidth: 2,
          },
        ],
      },
    }
    const bufferSvg = this.renderService.renderToBufferSync(params)
    return sharp(bufferSvg).png().toBuffer()
  }
}
