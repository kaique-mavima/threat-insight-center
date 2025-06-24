
// Configurações das APIs externas
export const API_CONFIG = {
  jira: {
    url: import.meta.env.VITE_JIRA_URL || '',
    email: import.meta.env.VITE_JIRA_EMAIL || '',
    apiToken: import.meta.env.VITE_JIRA_API_TOKEN || '',
  },
  googleSheets: {
    sheetId: import.meta.env.VITE_GOOGLE_SHEETS_ID || '',
    credentials: import.meta.env.VITE_GOOGLE_CREDENTIALS_JSON || '',
  },
  maps: {
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  }
};

export const JIRA_LABELS = {
  EMAIL: 'email',
  WEB: 'web',
  THREAT_INTEL: 'threat-intel',
} as const;
