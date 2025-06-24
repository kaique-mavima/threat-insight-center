
import { AlertNotification, NotificationChannels } from '@/types/notifications';

export class NotificationService {
  private static getStoredChannels(): NotificationChannels {
    return {
      slack: {
        webhookUrl: localStorage.getItem('slack_webhook_url') || '',
        enabled: localStorage.getItem('slack_enabled') === 'true',
      },
      teams: {
        webhookUrl: localStorage.getItem('teams_webhook_url') || '',
        enabled: localStorage.getItem('teams_enabled') === 'true',
      },
      telegram: {
        botToken: localStorage.getItem('telegram_bot_token') || '',
        chatId: localStorage.getItem('telegram_chat_id') || '',
        enabled: localStorage.getItem('telegram_enabled') === 'true',
      },
      smtp: {
        server: localStorage.getItem('smtp_server') || '',
        port: parseInt(localStorage.getItem('smtp_port') || '587'),
        username: localStorage.getItem('smtp_username') || '',
        password: localStorage.getItem('smtp_password') || '',
        fromEmail: localStorage.getItem('smtp_from_email') || '',
        toEmails: JSON.parse(localStorage.getItem('smtp_to_emails') || '[]'),
        enabled: localStorage.getItem('smtp_enabled') === 'true',
      },
    };
  }

  private static async sendSlackNotification(alert: AlertNotification, config: any) {
    console.log('Enviando notificação Slack:', { webhookUrl: config.webhookUrl, enabled: config.enabled });
    
    if (!config.webhookUrl || !config.enabled) {
      console.log('Slack não configurado ou desabilitado');
      return;
    }

    const payload = {
      text: `🚨 *${alert.title}*`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `🚨 *${alert.title}*\n\n*Descrição:* ${alert.description}\n*Severidade:* ${alert.severity}\n*Data/Hora:* ${new Date(alert.timestamp).toLocaleString('pt-BR')}\n*Origem:* ${alert.source || 'Sistema'}`
          }
        }
      ]
    };

    console.log('Payload Slack:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Resposta Slack:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro detalhado Slack:', errorText);
        throw new Error(`Slack API error: ${response.status} ${response.statusText}`);
      }
      
      console.log('Notificação Slack enviada com sucesso');
    } catch (error) {
      console.error('Erro ao enviar notificação Slack:', error);
      throw error;
    }
  }

  private static async sendTeamsNotification(alert: AlertNotification, config: any) {
    console.log('Enviando notificação Teams:', { webhookUrl: config.webhookUrl, enabled: config.enabled });
    
    if (!config.webhookUrl || !config.enabled) {
      console.log('Teams não configurado ou desabilitado');
      return;
    }

    const payload = {
      '@type': 'MessageCard',
      '@context': 'https://schema.org/extensions',
      summary: alert.title,
      themeColor: this.getSeverityColor(alert.severity).replace('#', ''),
      sections: [
        {
          activityTitle: `🚨 ${alert.title}`,
          activitySubtitle: `Severidade: ${alert.severity}`,
          text: alert.description,
          facts: [
            {
              name: 'Data/Hora',
              value: new Date(alert.timestamp).toLocaleString('pt-BR'),
            },
            {
              name: 'Severidade',
              value: alert.severity,
            },
            {
              name: 'Origem',
              value: alert.source || 'Sistema',
            },
          ],
        },
      ],
    };

    console.log('Payload Teams:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('Resposta Teams:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro detalhado Teams:', errorText);
        throw new Error(`Teams API error: ${response.status} ${response.statusText}`);
      }
      
      console.log('Notificação Teams enviada com sucesso');
    } catch (error) {
      console.error('Erro ao enviar notificação Teams:', error);
      throw error;
    }
  }

  private static async sendTelegramNotification(alert: AlertNotification, config: any) {
    console.log('Enviando notificação Telegram:', { botToken: config.botToken ? 'SET' : 'NOT_SET', chatId: config.chatId, enabled: config.enabled });
    
    if (!config.botToken || !config.chatId || !config.enabled) {
      console.log('Telegram não configurado ou desabilitado');
      return;
    }

    const message = `🚨 *${alert.title}*\n\n` +
      `📝 *Descrição:* ${alert.description}\n` +
      `⚠️ *Severidade:* ${alert.severity}\n` +
      `🕒 *Data/Hora:* ${new Date(alert.timestamp).toLocaleString('pt-BR')}\n` +
      `📍 *Origem:* ${alert.source || 'Sistema'}`;

    console.log('Mensagem Telegram:', message);

    try {
      const response = await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      console.log('Resposta Telegram:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro detalhado Telegram:', errorData);
        throw new Error(`Telegram API error: ${response.status} ${errorData.description}`);
      }
      
      console.log('Notificação Telegram enviada com sucesso');
    } catch (error) {
      console.error('Erro ao enviar notificação Telegram:', error);
      throw error;
    }
  }

  private static getSeverityColor(severity: string): string {
    switch (severity) {
      case 'Crítico':
        return '#dc2626';
      case 'Alto':
        return '#ea580c';
      case 'Médio':
        return '#eab308';
      case 'Baixo':
        return '#16a34a';
      default:
        return '#6b7280';
    }
  }

  public static async sendAlert(alert: AlertNotification) {
    console.log('Iniciando envio de alertas:', alert);
    const channels = this.getStoredChannels();
    console.log('Canais configurados:', channels);

    const results = [];

    // Enviar para Slack
    if (channels.slack.enabled && channels.slack.webhookUrl) {
      try {
        await this.sendSlackNotification(alert, channels.slack);
        results.push({ channel: 'Slack', success: true });
      } catch (error) {
        console.error('Falha no envio Slack:', error);
        results.push({ channel: 'Slack', success: false, error: error.message });
      }
    }

    // Enviar para Teams
    if (channels.teams.enabled && channels.teams.webhookUrl) {
      try {
        await this.sendTeamsNotification(alert, channels.teams);
        results.push({ channel: 'Teams', success: true });
      } catch (error) {
        console.error('Falha no envio Teams:', error);
        results.push({ channel: 'Teams', success: false, error: error.message });
      }
    }

    // Enviar para Telegram
    if (channels.telegram.enabled && channels.telegram.botToken && channels.telegram.chatId) {
      try {
        await this.sendTelegramNotification(alert, channels.telegram);
        results.push({ channel: 'Telegram', success: true });
      } catch (error) {
        console.error('Falha no envio Telegram:', error);
        results.push({ channel: 'Telegram', success: false, error: error.message });
      }
    }

    console.log('Resultados do envio:', results);
    return results;
  }

  public static async testConnection(type: string, config: any): Promise<boolean> {
    const testAlert: AlertNotification = {
      title: 'Teste de Conexão - SIC Dashboard',
      description: 'Esta é uma mensagem de teste para verificar se a integração está funcionando corretamente. Se você recebeu esta mensagem, a configuração está OK!',
      severity: 'Baixo',
      timestamp: new Date().toISOString(),
      source: 'Sistema de Teste',
    };

    console.log(`Testando conexão ${type} com config:`, config);

    try {
      switch (type) {
        case 'slack':
          await this.sendSlackNotification(testAlert, config);
          break;
        case 'teams':
          await this.sendTeamsNotification(testAlert, config);
          break;
        case 'telegram':
          await this.sendTelegramNotification(testAlert, config);
          break;
        default:
          console.error('Tipo de teste não suportado:', type);
          return false;
      }
      
      console.log(`Teste de conexão ${type} bem-sucedido`);
      return true;
    } catch (error) {
      console.error(`Erro ao testar conexão ${type}:`, error);
      return false;
    }
  }
}
