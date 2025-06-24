
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, CheckCircle, AlertCircle, MessageSquare, Mail, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NotificationService } from "@/services/notificationService";
import { NotificationChannels } from "@/types/notifications";

export function NotificationIntegrations() {
  const { toast } = useToast();
  const [configs, setConfigs] = useState<NotificationChannels>({
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
  });

  const [testResults, setTestResults] = useState<{[key: string]: boolean | null}>({
    slack: null,
    teams: null,
    telegram: null,
    smtp: null,
  });

  const [isTestingConnection, setIsTestingConnection] = useState<{[key: string]: boolean}>({
    slack: false,
    teams: false,
    telegram: false,
    smtp: false,
  });

  const handleConfigChange = (service: keyof NotificationChannels, field: string, value: any) => {
    setConfigs(prev => ({
      ...prev,
      [service]: {
        ...prev[service],
        [field]: value
      }
    }));
  };

  const saveConfig = (service: string) => {
    console.log(`Salvando configuração para ${service}:`, configs[service as keyof NotificationChannels]);
    
    if (service === 'slack') {
      const config = configs.slack;
      localStorage.setItem('slack_webhook_url', config.webhookUrl);
      localStorage.setItem('slack_enabled', config.enabled.toString());
    } else if (service === 'teams') {
      const config = configs.teams;
      localStorage.setItem('teams_webhook_url', config.webhookUrl);
      localStorage.setItem('teams_enabled', config.enabled.toString());
    } else if (service === 'telegram') {
      const config = configs.telegram;
      localStorage.setItem('telegram_bot_token', config.botToken);
      localStorage.setItem('telegram_chat_id', config.chatId);
      localStorage.setItem('telegram_enabled', config.enabled.toString());
    } else if (service === 'smtp') {
      const config = configs.smtp;
      localStorage.setItem('smtp_server', config.server);
      localStorage.setItem('smtp_port', config.port.toString());
      localStorage.setItem('smtp_username', config.username);
      localStorage.setItem('smtp_password', config.password);
      localStorage.setItem('smtp_from_email', config.fromEmail);
      localStorage.setItem('smtp_to_emails', JSON.stringify(config.toEmails));
      localStorage.setItem('smtp_enabled', config.enabled.toString());
    }

    toast({
      title: "Configuração salva",
      description: `Configurações do ${getServiceName(service)} foram salvas com sucesso.`,
    });
  };

  const testConnection = async (service: string) => {
    console.log(`Iniciando teste de conexão para ${service}`);
    
    setIsTestingConnection(prev => ({ ...prev, [service]: true }));
    setTestResults(prev => ({ ...prev, [service]: null }));
    
    const config = configs[service as keyof NotificationChannels];
    
    try {
      const result = await NotificationService.testConnection(service, config);
      
      setTestResults(prev => ({ ...prev, [service]: result }));
      
      toast({
        title: result ? "Teste bem-sucedido!" : "Falha no teste",
        description: result 
          ? "A mensagem de teste foi enviada com sucesso. Verifique seu canal de comunicação."
          : "Verifique suas configurações e tente novamente. Consulte o console para mais detalhes.",
        variant: result ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Erro no teste de conexão:', error);
      setTestResults(prev => ({ ...prev, [service]: false }));
      
      toast({
        title: "Erro no teste",
        description: "Ocorreu um erro ao tentar enviar a mensagem de teste. Verifique o console para mais detalhes.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(prev => ({ ...prev, [service]: false }));
    }
  };

  const getServiceName = (service: string) => {
    const names: {[key: string]: string} = {
      slack: 'Slack',
      teams: 'Microsoft Teams',
      telegram: 'Telegram',
      smtp: 'Email (SMTP)'
    };
    return names[service] || service;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Integrações de Notificações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="slack" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="slack">Slack</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="telegram">Telegram</TabsTrigger>
            <TabsTrigger value="smtp">Email</TabsTrigger>
          </TabsList>

          <TabsContent value="slack" className="space-y-4">
            <Alert>
              <MessageSquare className="h-4 w-4" />
              <AlertDescription>
                Configure o webhook do Slack para receber notificações de alertas em tempo real. Crie um webhook em: https://api.slack.com/messaging/webhooks
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="slack-enabled">Habilitar Slack</Label>
                <Switch
                  id="slack-enabled"
                  checked={configs.slack.enabled}
                  onCheckedChange={(checked) => handleConfigChange('slack', 'enabled', checked)}
                />
              </div>

              <div>
                <Label htmlFor="slack-webhook">Webhook URL *</Label>
                <Input
                  id="slack-webhook"
                  placeholder="https://hooks.slack.com/services/..."
                  value={configs.slack.webhookUrl}
                  onChange={(e) => handleConfigChange('slack', 'webhookUrl', e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={() => saveConfig('slack')}>
                  Salvar Configuração
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => testConnection('slack')}
                  disabled={!configs.slack.webhookUrl || isTestingConnection.slack}
                >
                  {isTestingConnection.slack ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testando...
                    </>
                  ) : (
                    'Testar Conexão'
                  )}
                </Button>
                {testResults.slack !== null && (
                  <div className="flex items-center gap-2">
                    {testResults.slack ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            <Alert>
              <MessageSquare className="h-4 w-4" />
              <AlertDescription>
                Configure o webhook do Microsoft Teams para receber notificações de alertas. Crie um conector de webhook em seu canal do Teams.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="teams-enabled">Habilitar Teams</Label>
                <Switch
                  id="teams-enabled"
                  checked={configs.teams.enabled}
                  onCheckedChange={(checked) => handleConfigChange('teams', 'enabled', checked)}
                />
              </div>

              <div>
                <Label htmlFor="teams-webhook">Webhook URL *</Label>
                <Input
                  id="teams-webhook"
                  placeholder="https://outlook.office.com/webhook/..."
                  value={configs.teams.webhookUrl}
                  onChange={(e) => handleConfigChange('teams', 'webhookUrl', e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={() => saveConfig('teams')}>
                  Salvar Configuração
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => testConnection('teams')}
                  disabled={!configs.teams.webhookUrl || isTestingConnection.teams}
                >
                  {isTestingConnection.teams ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testando...
                    </>
                  ) : (
                    'Testar Conexão'
                  )}
                </Button>
                {testResults.teams !== null && (
                  <div className="flex items-center gap-2">
                    {testResults.teams ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="telegram" className="space-y-4">
            <Alert>
              <Send className="h-4 w-4" />
              <AlertDescription>
                Configure o bot do Telegram para receber notificações. Crie um bot via @BotFather e obtenha o token. Para o Chat ID, adicione o bot ao grupo/canal desejado.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="telegram-enabled">Habilitar Telegram</Label>
                <Switch
                  id="telegram-enabled"
                  checked={configs.telegram.enabled}
                  onCheckedChange={(checked) => handleConfigChange('telegram', 'enabled', checked)}
                />
              </div>

              <div>
                <Label htmlFor="telegram-token">Token do Bot *</Label>
                <Input
                  id="telegram-token"
                  type="password"
                  placeholder="123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg"
                  value={configs.telegram.botToken}
                  onChange={(e) => handleConfigChange('telegram', 'botToken', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="telegram-chat">ID do Chat/Grupo *</Label>
                <Input
                  id="telegram-chat"
                  placeholder="-123456789 ou @username"
                  value={configs.telegram.chatId}
                  onChange={(e) => handleConfigChange('telegram', 'chatId', e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={() => saveConfig('telegram')}>
                  Salvar Configuração
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => testConnection('telegram')}
                  disabled={!configs.telegram.botToken || !configs.telegram.chatId || isTestingConnection.telegram}
                >
                  {isTestingConnection.telegram ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testando...
                    </>
                  ) : (
                    'Testar Conexão'
                  )}
                </Button>
                {testResults.telegram !== null && (
                  <div className="flex items-center gap-2">
                    {testResults.telegram ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="smtp" className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Configure o servidor SMTP para enviar notificações por email (Em desenvolvimento).
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="smtp-enabled">Habilitar Email</Label>
                <Switch
                  id="smtp-enabled"
                  checked={configs.smtp.enabled}
                  onCheckedChange={(checked) => handleConfigChange('smtp', 'enabled', checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp-server">Servidor SMTP</Label>
                  <Input
                    id="smtp-server"
                    placeholder="smtp.gmail.com"
                    value={configs.smtp.server}
                    onChange={(e) => handleConfigChange('smtp', 'server', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="smtp-port">Porta</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    placeholder="587"
                    value={configs.smtp.port}
                    onChange={(e) => handleConfigChange('smtp', 'port', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp-username">Usuário</Label>
                  <Input
                    id="smtp-username"
                    placeholder="usuario@exemplo.com"
                    value={configs.smtp.username}
                    onChange={(e) => handleConfigChange('smtp', 'username', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="smtp-password">Senha</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    placeholder="senha"
                    value={configs.smtp.password}
                    onChange={(e) => handleConfigChange('smtp', 'password', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="smtp-from">Email de Origem</Label>
                <Input
                  id="smtp-from"
                  placeholder="alertas@empresa.com"
                  value={configs.smtp.fromEmail}
                  onChange={(e) => handleConfigChange('smtp', 'fromEmail', e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={() => saveConfig('smtp')}>
                  Salvar Configuração
                </Button>
                <Button variant="outline" disabled>
                  Testar Conexão (Em breve)
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
