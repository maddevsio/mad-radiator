import { FirestoreConfig, RadiatorConfig, RangeType } from 'interfaces'

export const defaultConfig: RadiatorConfig = {
  scheduleConfig: { period: '', time: 0 },
  authType: '',
  analyticsProjectId: '',
  analyticsPrivateKeyId: '',
  analyticsPrivateKey: '',
  analyticsClientEmail: '',
  analyticsClientId: '',
  analyticsAuthUrl: '',
  analyticsTokenUri: '',
  analyticsProviderCertUrl: '',
  analyticsClientCertUrl: '',
  googleapisKey: '',
  websiteUrl: '',
  expiryDate: 0,
  tokenType: '',
  idToken: '',
  range: RangeType.day,
  retryAttempts: 2,
  sentryConfig: {
    sentryDSN: '',
    tracesSampleRate: 0,
  },
}

export const defaultFirestoreConfig: FirestoreConfig = {
  authType: '',
  firestoreProjectId: '',
  firestorePrivateKeyId: '',
  firestorePrivateKey: '',
  firestoreClientEmail: '',
  firestoreClientId: '',
  firestoreAuthUri: '',
  firestoreTokenUri: '',
  firestoreAuthProviderCertUrl: '',
  firestoreClientCertUrl: '',
}
