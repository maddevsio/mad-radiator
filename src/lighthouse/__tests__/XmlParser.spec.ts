import { XmlParser } from 'lighthouse/XmlParser'

describe('XmlParser', () => {
  it('should correctly parse an xml string', () => {
    const xmlString = '<loc>website url</loc>'

    const result = XmlParser.parseTags(xmlString, 'loc')

    expect(result).toEqual(['website url'])
  })

  it('should correctly return an empty array if no matches', () => {
    const xmlString = '<loc>website url</loc>'

    const result = XmlParser.parseTags(xmlString, 'locs')

    expect(result).toEqual([])
  })
})
