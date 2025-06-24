
export interface SlackConfig {
  webhookUrl: string;
  enabled: boolean;
}

export interface TeamsConfig {
  webhookUrl: string;
  enabled: boolean;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
}

export interface SmtpConfig {
  server: string;
  port: number;
  username: string;
  password: string;
  fromEmail: string;
  toEmails: string[];
  enabled: boolean;
}

export interface NotificationChannels {
  slack: SlackConfig;
  teams: TeamsConfig;
  telegram: TelegramConfig;
  smtp: SmtpConfig;
}

export interface AlertNotification {
  title: string;
  description: string;
  severity: 'Crítico' | 'Alto' | 'Médio' | 'Baixo';
  timestamp: string;
  source?: string;
}
