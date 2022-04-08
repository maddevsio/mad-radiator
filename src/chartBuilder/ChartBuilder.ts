import { AnalyticsParams } from 'analytics/interfaces'
import { ChartError } from 'errors/types/ChartError'
import QuickChart from 'quickchart-js';

export class ChartBuilder {
  private defaultColor = 'white'

  private renderService: QuickChart

  view: string | undefined;

  constructor(analyticsParams: AnalyticsParams) {
    this.renderService = new QuickChart();
    this.view = analyticsParams?.chart?.chartView;
  }

  public async renderChart(chartData: Record<string, number>) {
    try {
      this.renderService
        .setConfig({
          type: this.view,
          data: { labels: Object.keys(chartData), datasets: [{ label: 'Active Users', data: Object.values(chartData) }] },
        })
        .setWidth(800)
        .setHeight(400)
        .setBackgroundColor(this.defaultColor);

      return await this.renderService.toBinary()
    }
    catch (error: any) {
     throw new ChartError(error)
    }
  }
}
