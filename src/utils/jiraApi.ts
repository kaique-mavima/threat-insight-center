
import { API_CONFIG, JIRA_LABELS } from '@/config/api';

export interface JiraIssue {
  id: string;
  key: string;
  summary: string;
  status: string;
  priority: string;
  assignee?: string;
  created: string;
  updated: string;
  labels: string[];
  description?: string;
  country?: string;
}

class JiraApiService {
  private baseUrl: string;
  private credentials: string;

  constructor() {
    this.baseUrl = API_CONFIG.jira.url;
    this.credentials = btoa(`${API_CONFIG.jira.email}:${API_CONFIG.jira.apiToken}`);
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    if (!this.baseUrl || !API_CONFIG.jira.email || !API_CONFIG.jira.apiToken) {
      throw new Error('Configurações do Jira não encontradas');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Basic ${this.credentials}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na API do Jira: ${response.status}`);
    }

    return response.json();
  }

  async getIssuesByLabel(label: string): Promise<JiraIssue[]> {
    try {
      const jql = `labels = "${label}" AND status != "Done" ORDER BY created DESC`;
      const response = await this.makeRequest(
        `/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=100`
      );

      return response.issues.map((issue: any) => ({
        id: issue.id,
        key: issue.key,
        summary: issue.fields.summary,
        status: issue.fields.status.name,
        priority: issue.fields.priority?.name || 'Médio',
        assignee: issue.fields.assignee?.displayName,
        created: issue.fields.created,
        updated: issue.fields.updated,
        labels: issue.fields.labels,
        description: issue.fields.description?.content?.[0]?.content?.[0]?.text,
        country: issue.fields.customfield_country || undefined,
      }));
    } catch (error) {
      console.error('Erro ao buscar issues do Jira:', error);
      return [];
    }
  }

  async updateIssue(issueKey: string, updateData: Partial<JiraIssue>) {
    try {
      const payload = {
        fields: {
          ...(updateData.summary && { summary: updateData.summary }),
          ...(updateData.description && { description: updateData.description }),
        }
      };

      await this.makeRequest(`/rest/api/3/issue/${issueKey}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      return true;
    } catch (error) {
      console.error('Erro ao atualizar issue do Jira:', error);
      return false;
    }
  }

  async getEmailIssues() {
    return this.getIssuesByLabel(JIRA_LABELS.EMAIL);
  }

  async getWebIssues() {
    return this.getIssuesByLabel(JIRA_LABELS.WEB);
  }

  async getThreatIntelIssues() {
    return this.getIssuesByLabel(JIRA_LABELS.THREAT_INTEL);
  }
}

export const jiraApi = new JiraApiService();
