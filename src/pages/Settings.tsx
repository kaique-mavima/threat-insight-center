import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Settings as SettingsIcon, Database, Bell, Mail, MessageCircle, Users, Slack } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
const Settings = () => {
  const {
    toast
  } = useToast();

  // Notification settings state
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [teamsEnabled, setTeamsEnabled] = useState(false);
  const [slackEnabled, setSlackEnabled] = useState(false);

  // Configuration fields
  const [emailConfig, setEmailConfig] = useState({
    smtpServer: "",
    port: "587",
    username: "",
    password: ""
  });
  const [telegramConfig, setTelegramConfig] = useState({
    botToken: "",
    chatId: ""
  });
  const [teamsConfig, setTeamsConfig] = useState({
    webhookUrl: ""
  });
  const [slackConfig, setSlackConfig] = useState({
    webhookUrl: "",
    channel: ""
  });
  const handleSaveNotificationSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações de notificação foram atualizadas com sucesso."
    });
  };
  return <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-400 to-slate-400 bg-clip-text text-transparent">
            Configurações
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure as definições do sistema e integrações
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Integrações
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Conexão Jira</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-sm text-red-400">Não Conectado</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Google Sheets</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-sm text-red-400">Não Conectado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Configuration */}
          

          {/* Email Notifications */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Notificações por Email
              </h3>
              <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
            </div>
            {emailEnabled && <div className="space-y-3">
                <div>
                  <Label htmlFor="smtp-server">Servidor SMTP</Label>
                  <Input id="smtp-server" value={emailConfig.smtpServer} onChange={e => setEmailConfig({
                ...emailConfig,
                smtpServer: e.target.value
              })} placeholder="smtp.gmail.com" />
                </div>
                <div>
                  <Label htmlFor="smtp-port">Porta</Label>
                  <Input id="smtp-port" value={emailConfig.port} onChange={e => setEmailConfig({
                ...emailConfig,
                port: e.target.value
              })} placeholder="587" />
                </div>
                <div>
                  <Label htmlFor="smtp-username">Usuário</Label>
                  <Input id="smtp-username" value={emailConfig.username} onChange={e => setEmailConfig({
                ...emailConfig,
                username: e.target.value
              })} placeholder="seu-email@dominio.com" />
                </div>
                <div>
                  <Label htmlFor="smtp-password">Senha</Label>
                  <Input id="smtp-password" type="password" value={emailConfig.password} onChange={e => setEmailConfig({
                ...emailConfig,
                password: e.target.value
              })} placeholder="Senha do aplicativo" />
                </div>
              </div>}
          </div>

          {/* Telegram Notifications */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Notificações Telegram
              </h3>
              <Switch checked={telegramEnabled} onCheckedChange={setTelegramEnabled} />
            </div>
            {telegramEnabled && <div className="space-y-3">
                <div>
                  <Label htmlFor="telegram-token">Token do Bot</Label>
                  <Input id="telegram-token" value={telegramConfig.botToken} onChange={e => setTelegramConfig({
                ...telegramConfig,
                botToken: e.target.value
              })} placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" />
                </div>
                <div>
                  <Label htmlFor="telegram-chat">ID do Chat</Label>
                  <Input id="telegram-chat" value={telegramConfig.chatId} onChange={e => setTelegramConfig({
                ...telegramConfig,
                chatId: e.target.value
              })} placeholder="-1001234567890" />
                </div>
              </div>}
          </div>

          {/* Teams Notifications */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Microsoft Teams
              </h3>
              <Switch checked={teamsEnabled} onCheckedChange={setTeamsEnabled} />
            </div>
            {teamsEnabled && <div className="space-y-3">
                <div>
                  <Label htmlFor="teams-webhook">URL do Webhook</Label>
                  <Input id="teams-webhook" value={teamsConfig.webhookUrl} onChange={e => setTeamsConfig({
                ...teamsConfig,
                webhookUrl: e.target.value
              })} placeholder="https://seu-tenant.webhook.office.com/webhookb2/..." />
                </div>
              </div>}
          </div>

          {/* Slack Notifications */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Slack className="w-5 h-5" />
                Notificações Slack
              </h3>
              <Switch checked={slackEnabled} onCheckedChange={setSlackEnabled} />
            </div>
            {slackEnabled && <div className="space-y-3">
                <div>
                  <Label htmlFor="slack-webhook">URL do Webhook</Label>
                  <Input id="slack-webhook" value={slackConfig.webhookUrl} onChange={e => setSlackConfig({
                ...slackConfig,
                webhookUrl: e.target.value
              })} placeholder="https://hooks.slack.com/services/..." />
                </div>
                <div>
                  <Label htmlFor="slack-channel">Canal</Label>
                  <Input id="slack-channel" value={slackConfig.channel} onChange={e => setSlackConfig({
                ...slackConfig,
                channel: e.target.value
              })} placeholder="#alertas" />
                </div>
              </div>}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveNotificationSettings} className="px-6">
            Salvar Configurações de Notificação
          </Button>
        </div>
      </div>
    </Layout>;
};
export default Settings;