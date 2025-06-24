
import { useCallback } from 'react';
import { AlertNotification } from '@/types/notifications';
import { NotificationService } from '@/services/notificationService';

export const useNotifications = () => {
  const sendAlert = useCallback(async (alert: AlertNotification) => {
    try {
      await NotificationService.sendAlert(alert);
      console.log('Alerta enviado para canais de notificação');
    } catch (error) {
      console.error('Erro ao enviar alerta:', error);
    }
  }, []);

  const createAlertFromJiraIssue = useCallback((issue: any): AlertNotification => {
    // Mapear dados do Jira para o formato de alerta
    const severityMap: {[key: string]: AlertNotification['severity']} = {
      'Highest': 'Crítico',
      'High': 'Alto',
      'Medium': 'Médio',
      'Low': 'Baixo',
      'Lowest': 'Baixo'
    };

    return {
      title: issue.fields?.summary || 'Novo Alerta',
      description: issue.fields?.description || 'Sem descrição disponível',
      severity: severityMap[issue.fields?.priority?.name] || 'Médio',
      timestamp: issue.fields?.created || new Date().toISOString(),
      source: 'Jira'
    };
  }, []);

  const sendJiraAlert = useCallback(async (issue: any) => {
    const alert = createAlertFromJiraIssue(issue);
    await sendAlert(alert);
  }, [createAlertFromJiraIssue, sendAlert]);

  return {
    sendAlert,
    sendJiraAlert,
    createAlertFromJiraIssue
  };
};
