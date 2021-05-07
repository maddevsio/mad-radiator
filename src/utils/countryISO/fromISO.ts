import countries from 'utils/countryISO/countries'

export function fromISO(country: string): string | null {
  const found = countries.find(c => c.Code.toLowerCase() === country.toLowerCase())
  if (!found) return null
  return found.Name
}
