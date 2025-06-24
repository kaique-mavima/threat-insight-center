
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
    if (!config.webhookUrl || !config.enabled) return;

    const payload = {
      text: `🚨 *${alert.title}*`,
      attachments: [
        {
          color: this.getSeverityColor(alert.severity),
          fields: [
            {
              title: 'Descrição',
              value: alert.description,
              short: false,
            },
            {
              title: 'Severidade',
              value: alert.severity,
              short: true,
            },
            {
              title: 'Data/Hora',
              value: new Date(alert.timestamp).toLocaleString('pt-BR'),
              short: true,
            },
          ],
        },
      ],
    };

    try {
      await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Erro ao enviar notificação Slack:', error);
    }
  }

  private static async sendTeamsNotification(alert: AlertNotification, config: any) {
    if (!config.webhookUrl || !config.enabled) return;

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
          ],
        },
      ],
    };

    try {
      await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Erro ao enviar notificação Teams:', error);
    }
  }

  private static async sendTelegramNotification(alert: AlertNotification, config: any) {
    if (!config.botToken || !config.chatId || !config.enabled) return;

    const message = `🚨 *${alert.title}*\n\n` +
      `📝 *Descrição:* ${alert.description}\n` +
      `⚠️ *Severidade:* ${alert.severity}\n` +
      `🕒 *Data/Hora:* ${new Date(alert.timestamp).toLocaleString('pt-BR')}`;

    try {
      await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });
    } catch (error) {
      console.error('Erro ao enviar notificação Telegram:', error);
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
    const channels = this.getStoredChannels();

    // Enviar para todos os canais configurados de forma assíncrona
    const notifications = [
      this.sendSlackNotification(alert, channels.slack),
      this.sendTeamsNotification(alert, channels.teams),
      this.sendTelegramNotification(alert, channels.telegram),
    ];

    try {
      await Promise.allSettled(notifications);
      console.log('Notificações enviadas com sucesso');
    } catch (error) {
      console.error('Erro ao enviar notificações:', error);
    }
  }

  public static async testConnection(type: string, config: any): Promise<boolean> {
    const testAlert: AlertNotification = {
      title: 'Teste de Conexão',
      description: 'Esta é uma mensagem de teste para verificar a configuração.',
      severity: 'Baixo',
      timestamp: new Date().toISOString(),
      source: 'Sistema de Teste',
    };

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
          return false;
      }
      return true;
    } catch (error) {
      console.error(`Erro ao testar conexão ${type}:`, error);
      return false;
    }
  }
}
