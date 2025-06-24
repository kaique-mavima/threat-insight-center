import { API_CONFIG } from "@/config/api";

export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    description: string;
    status: {
      name: string;
    };
    priority: {
      name: string;
    };
    created: string;
    labels: string[];
    assignee: {
      displayName: string;
    } | null;
  };
}

import { NotificationService } from '@/services/notificationService';
import { AlertNotification } from '@/types/notifications';

const getJiraConfig = () => {
  return {
    url: API_CONFIG.jira.url,
    email: API_CONFIG.jira.email,
    apiToken: API_CONFIG.jira.apiToken,
  };
};

export const searchJiraIssues = async (jql: string = '', labels: string[] = []): Promise<JiraIssue[]> => {
  const config = getJiraConfig();
  
  if (!config.url || !config.email || !config.apiToken) {
    throw new Error('Configuração do Jira não encontrada');
  }

  let query = jql;
  if (labels.length > 0) {
    const labelsQuery = labels.map(label => `labels = "${label}"`).join(' OR ');
    query = query ? `(${query}) AND (${labelsQuery})` : `(${labelsQuery})`;
  }

  // Adicionar filtro para issues criadas recentemente (últimas 24h) se não especificado
  if (!query.includes('created')) {
    query = query ? `${query} AND created >= -1d` : 'created >= -1d';
  }

  const url = `${config.url}/rest/api/2/search`;
  const auth = btoa(`${config.email}:${config.apiToken}`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jql: query,
        maxResults: 100,
        fields: ['summary', 'description', 'status', 'priority', 'created', 'labels', 'assignee']
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na API do Jira: ${response.status}`);
    }

    const data = await response.json();
    
    // Verificar se há novos alertas e enviar notificações
    if (data.issues && data.issues.length > 0)  {
      const newIssues = data.issues.filter((issue: any) => {
        const created = new Date(issue.fields.created);
        const now = new Date();
        const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
        return hoursDiff <= 1; // Issues criadas na última hora
      });

      // Enviar notificações para issues realmente novas
      for (const issue of newIssues) {
        const alert: AlertNotification = {
          title: issue.fields.summary || 'Novo Alerta Jira',
          description: issue.fields.description || 'Sem descrição disponível',
          severity: mapJiraPriorityToSeverity(issue.fields.priority?.name),
          timestamp: issue.fields.created,
          source: 'Jira'
        };

        // Enviar notificação de forma assíncrona
        NotificationService.sendAlert(alert).catch(error => 
          console.error('Erro ao enviar notificação:', error)
        );
      }
    }

    return data.issues || [];
  } catch (error) {
    console.error('Erro ao buscar issues do Jira:', error);
    throw error;
  }
};

function mapJiraPriorityToSeverity(priority: string): AlertNotification['severity'] {
  const severityMap: {[key: string]: AlertNotification['severity']} = {
    'Highest': 'Crítico',
    'High': 'Alto',
    'Medium': 'Médio',
    'Low': 'Baixo',
    'Lowest': 'Baixo'
  };
  
  return severityMap[priority] || 'Médio';
}

export const updateJiraIssue = async (issueId: string, data: { fields: any }) => {
  const config = getJiraConfig();

  if (!config.url || !config.email || !config.apiToken) {
    throw new Error('Jira configuration not found');
  }

  const url = `${config.url}/rest/api/2/issue/${issueId}`;
  const auth = btoa(`${config.email}:${config.apiToken}`);

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Jira API error: ${response.status}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error updating Jira issue:', error);
    return { success: false, error: error.message };
  }
};
