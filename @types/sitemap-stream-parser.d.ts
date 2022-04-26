declare module 'sitemap-stream-parser' {
  export function parseSitemaps(
    link: string,
    onParse: (xml: string) => void,
    onSuccess: () => void
  ): void 
}
