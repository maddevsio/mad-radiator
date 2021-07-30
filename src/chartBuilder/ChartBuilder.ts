import { ChartConfiguration } from 'chart.js'
import { ChartJSNodeCanvas, ChartJSNodeCanvasOptions } from 'chartjs-node-canvas'
import sharp from 'sharp'

export class ChartBuilder {
  private readonly renderService: ChartJSNodeCanvas

  private static defaultColor = '#ec1c24'

  // @ts-ignore
  private static chartCallback = ChartJS => {
    // eslint-disable-next-line
    ChartJS.defaults.backgroundColor = ChartBuilder.defaultColor
    // eslint-disable-next-line
    ChartJS.defaults.color = ChartBuilder.defaultColor
    // eslint-disable-next-line
    ChartJS.defaults.font.size = 20
    // eslint-disable-next-line
    ChartJS.defaults.font.weight = 'bold'
  }

  private static chartOptions: ChartJSNodeCanvasOptions = {
    width: 1920,
    height: 1080,
    type: 'svg',
    chartCallback: ChartBuilder.chartCallback,
  }

  constructor() {
    this.renderService = new ChartJSNodeCanvas(ChartBuilder.chartOptions)
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
            backgroundColor: [ChartBuilder.defaultColor],
            borderColor: [ChartBuilder.defaultColor],
            borderWidth: 2,
          },
        ],
      },
    }
    const bufferSvg = this.renderService.renderToBufferSync(params)
    return sharp(bufferSvg).png().toBuffer()
  }
}
