export interface IResponseFromMoosend {
  Code: number
  Error: string | null
  Context: {
    Paging: {
      PageSize: number
      CurrentPage: number
      TotalResults: number
      TotalPageCount: number
      SortExpression: string
      SortIsAscending: boolean
    }
    Subscribers: Array<{
      ID: string
      Name: string
      Email: string
      CreatedOn: string
      UpdatedOn: string
      UnsubscribedOn: string | null
      UnsubscribedFromID: string | null
      SubscribeType: number
      SubscribeMethod: number
      CustomFields: { [key: string]: any }[]
      RemovedOn: string | null
    }>
  }
}
