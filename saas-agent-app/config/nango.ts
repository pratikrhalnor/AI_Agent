// Configuration for Nango
export const NANGO_CONFIG = {
  hostedURL: process.env.NANGO_HOSTED_URL || 'http://localhost:3003',
  secretKey: process.env.NANGO_SECRET_KEY || '',
  // No publicKey needed for self-hosted
};

console.log('Nango Config:', {
  hostedURL: NANGO_CONFIG.hostedURL,
  hasSecretKey: !!NANGO_CONFIG.secretKey,
});

export const PROVIDERS = {
  GITHUB: 'github',
  GOOGLE: 'google',
  SLACK: 'slack',
  NOTION: 'notion',
  SPOTIFY: 'spotify',
  LINKEDIN: 'linkedin',
  HUBSPOT: 'hubspot',
  TWITTER: 'twitter',
} as const;

export type Provider = typeof PROVIDERS[keyof typeof PROVIDERS];