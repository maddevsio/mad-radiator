import countries from 'utils/countryISO/countries'

export function toISO(country: string): string | null {
  const found = countries.find(c => c.Name === country)
  if (!found) return null
  return found.Code
}
