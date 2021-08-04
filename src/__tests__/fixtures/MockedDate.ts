export class MockedDate extends Date {
  public setDate(date: number) {
    return date
  }

  public getDate() {
    return 2
  }

  public toLocaleDateString() {
    return '4/25/2021'
  }
}
