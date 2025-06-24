
import { API_CONFIG } from '@/config/api';

export interface BreachedCredential {
  id: string;
  email: string;
  password?: string;
  source: string;
  breachDate: string;
  domain: string;
  country?: string;
}

class GoogleSheetsService {
  private sheetId: string;
  private apiKey: string;

  constructor() {
    this.sheetId = API_CONFIG.googleSheets.sheetId;
    this.apiKey = this.extractApiKeyFromCredentials();
  }

  private extractApiKeyFromCredentials(): string {
    try {
      if (API_CONFIG.googleSheets.credentials) {
        const credentials = JSON.parse(API_CONFIG.googleSheets.credentials);
        return credentials.api_key || '';
      }
      return '';
    } catch {
      return '';
    }
  }

  async getCredentialsData(): Promise<BreachedCredential[]> {
    if (!this.sheetId || !this.apiKey) {
      console.warn('Configurações do Google Sheets não encontradas');
      return this.getMockData();
    }

    try {
      const range = 'A:F'; // Assumindo que os dados estão nas colunas A-F
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${range}?key=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro na API do Google Sheets: ${response.status}`);
      }

      const data = await response.json();
      const rows = data.values || [];
      
      // Remove header row
      const dataRows = rows.slice(1);
      
      return dataRows.map((row: string[], index: number) => ({
        id: `breach-${index + 1}`,
        email: row[0] || '',
        password: row[1] || '',
        source: row[2] || 'Desconhecido',
        breachDate: row[3] || '',
        domain: row[4] || '',
        country: row[5] || '',
      }));
    } catch (error) {
      console.error('Erro ao buscar dados do Google Sheets:', error);
      return this.getMockData();
    }
  }

  private getMockData(): BreachedCredential[] {
    return [
      {
        id: 'breach-1',
        email: 'usuario1@empresa.com',
        password: '***masked***',
        source: 'Collection #1',
        breachDate: '2024-01-15',
        domain: 'empresa.com',
        country: 'BR'
      },
      {
        id: 'breach-2',
        email: 'admin@empresa.com',
        password: '***masked***',
        source: 'LinkedIn',
        breachDate: '2024-02-20',
        domain: 'empresa.com',
        country: 'US'
      },
      {
        id: 'breach-3',
        email: 'contato@empresa.com',
        password: '***masked***',
        source: 'Dropbox',
        breachDate: '2024-03-10',
        domain: 'empresa.com',
        country: 'BR'
      },
      {
        id: 'breach-4',
        email: 'suporte@empresa.com',
        password: '***masked***',
        source: 'Adobe',
        breachDate: '2024-01-25',
        domain: 'empresa.com',
        country: 'CA'
      },
      {
        id: 'breach-5',
        email: 'vendas@empresa.com',
        password: '***masked***',
        source: 'MySpace',
        breachDate: '2024-02-15',
        domain: 'empresa.com',
        country: 'BR'
      }
    ];
  }
}

export const googleSheetsApi = new GoogleSheetsService();
