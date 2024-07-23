export interface FirestoreData {
  data: [
    {
      document: {
        name: string
        fields: {
          count: {
            integerValue: string
          }
        }
        createTime: string
        updateTime: string
      }
      readTime: string
    },
  ]
}
