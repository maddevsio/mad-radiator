export interface AuthorizationWithTokenParams {
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  accessToken: string,
  refreshToken: string,
  googleapisKey: string,
  expiryDate?: number,
  tokenType?: string,
  idToken?:string,
}

export interface AuthorizationWithKeyParams {
  authType: string,
  analyticsProjectId: string
  analyticsPrivateKeyId: string
  analyticsPrivateKey: string,
  analyticsClientEmail: string,
  analyticsClientId: string,
  analyticsAuthUrl: string,
  analyticsTokenUri: string,
  analyticsProviderCertUrl: string,
  analyticsClientCertUrl: string,
  googleapisKey: string,
}
