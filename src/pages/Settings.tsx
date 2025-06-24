
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Settings as SettingsIcon, Database, Bell, Shield, Mail, MessageCircle, Users, Slack } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  
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
      description: "As configurações de notificação foram atualizadas com sucesso.",
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-400 to-slate-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure system settings and integrations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Integrations
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Jira Connection</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-sm text-red-400">Not Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Google Sheets</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-sm text-red-400">Not Connected</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </h3>
            <p className="text-sm text-muted-foreground">
              Configure authentication methods, session timeouts, and security policies.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              System Configuration
            </h3>
            <p className="text-sm text-muted-foreground">
              Manage system-wide settings, data retention policies, and performance configurations.
            </p>
          </div>

          {/* Email Notifications */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Notifications
              </h3>
              <Switch
                checked={emailEnabled}
                onCheckedChange={setEmailEnabled}
              />
            </div>
            {emailEnabled && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="smtp-server">SMTP Server</Label>
                  <Input
                    id="smtp-server"
                    value={emailConfig.smtpServer}
                    onChange={(e) => setEmailConfig({...emailConfig, smtpServer: e.target.value})}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtp-port">Port</Label>
                  <Input
                    id="smtp-port"
                    value={emailConfig.port}
                    onChange={(e) => setEmailConfig({...emailConfig, port: e.target.value})}
                    placeholder="587"
                  />
                </div>
                <div>
                  <Label htmlFor="smtp-username">Username</Label>
                  <Input
                    id="smtp-username"
                    value={emailConfig.username}
                    onChange={(e) => setEmailConfig({...emailConfig, username: e.target.value})}
                    placeholder="your-email@domain.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtp-password">Password</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    value={emailConfig.password}
                    onChange={(e) => setEmailConfig({...emailConfig, password: e.target.value})}
                    placeholder="App password"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Telegram Notifications */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Telegram Notifications
              </h3>
              <Switch
                checked={telegramEnabled}
                onCheckedChange={setTelegramEnabled}
              />
            </div>
            {telegramEnabled && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="telegram-token">Bot Token</Label>
                  <Input
                    id="telegram-token"
                    value={telegramConfig.botToken}
                    onChange={(e) => setTelegramConfig({...telegramConfig, botToken: e.target.value})}
                    placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                  />
                </div>
                <div>
                  <Label htmlFor="telegram-chat">Chat ID</Label>
                  <Input
                    id="telegram-chat"
                    value={telegramConfig.chatId}
                    onChange={(e) => setTelegramConfig({...telegramConfig, chatId: e.target.value})}
                    placeholder="-1001234567890"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Teams Notifications */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Microsoft Teams
              </h3>
              <Switch
                checked={teamsEnabled}
                onCheckedChange={setTeamsEnabled}
              />
            </div>
            {teamsEnabled && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="teams-webhook">Webhook URL</Label>
                  <Input
                    id="teams-webhook"
                    value={teamsConfig.webhookUrl}
                    onChange={(e) => setTeamsConfig({...teamsConfig, webhookUrl: e.target.value})}
                    placeholder="https://your-tenant.webhook.office.com/webhookb2/..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Slack Notifications */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Slack className="w-5 h-5" />
                Slack Notifications
              </h3>
              <Switch
                checked={slackEnabled}
                onCheckedChange={setSlackEnabled}
              />
            </div>
            {slackEnabled && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="slack-webhook">Webhook URL</Label>
                  <Input
                    id="slack-webhook"
                    value={slackConfig.webhookUrl}
                    onChange={(e) => setSlackConfig({...slackConfig, webhookUrl: e.target.value})}
                    placeholder="https://hooks.slack.com/services/..."
                  />
                </div>
                <div>
                  <Label htmlFor="slack-channel">Channel</Label>
                  <Input
                    id="slack-channel"
                    value={slackConfig.channel}
                    onChange={(e) => setSlackConfig({...slackConfig, channel: e.target.value})}
                    placeholder="#alerts"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveNotificationSettings} className="px-6">
            Save Notification Settings
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
