export interface EnvironmentConfig {
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  accessToken: string,
  refreshToken: string,
  expiryDate?: number,
  tokenType?: string,
  idToken?: string,
}
