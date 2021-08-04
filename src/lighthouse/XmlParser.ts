export class XmlParser {
  static parseToJson(xmlString: string): Array<string> {
    const globalRegexp = /<loc>(.*?)<\/loc>/g
    const regexp = /<loc>(.*?)<\/loc>/
    const match = xmlString.match(globalRegexp)
    return (
      (match?.map(res => res.match(regexp)?.[1]).filter(res => Boolean(res)) as Array<string>) || []
    )
  }
}
