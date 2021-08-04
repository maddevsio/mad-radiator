export class XmlParser {
  static parseTags(xmlString: string, tag: string): Array<string> {
    const globalRegexp = new RegExp(`<${tag}>(.*?)<\\/${tag}>`, 'g')
    const regexp = new RegExp(`<${tag}>(.*?)<\\/${tag}>`)
    const match = xmlString.match(globalRegexp)
    return (
      (match?.map(res => res.match(regexp)?.[1]).filter(res => Boolean(res)) as Array<string>) || []
    )
  }
}
