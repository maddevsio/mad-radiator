export class RunCounter {
  private runCounter: number = 0

  public getRunCounter() {
    return this.runCounter
  }

  public incrementRunCounter() {
    this.runCounter += 1
  }

  public resetRunCounter() {
    this.runCounter = 0
  }
}
