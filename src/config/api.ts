
// Configurações das APIs externas
export const API_CONFIG = {
  jira: {
    url: process.env.VITE_JIRA_URL || '',
    email: process.env.VITE_JIRA_EMAIL || '',
    apiToken: process.env.VITE_JIRA_API_TOKEN || '',
  },
  googleSheets: {
    sheetId: process.env.VITE_GOOGLE_SHEETS_ID || '',
    credentials: process.env.VITE_GOOGLE_CREDENTIALS_JSON || '',
  },
  maps: {
    apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || '',
  }
};

export const JIRA_LABELS = {
  EMAIL: 'email',
  WEB: 'web',
  THREAT_INTEL: 'threat-intel',
} as const;
