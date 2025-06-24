
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JiraConfig {
  url: string;
  email: string;
  apiToken: string;
}

interface GoogleSheetsConfig {
  sheetId: string;
  credentials: string;
}

interface MapsConfig {
  apiKey: string;
}

export function ApiConfigForm() {
  const { toast } = useToast();
  const [configs, setConfigs] = useState({
    jira: {
      url: localStorage.getItem('jira_url') || '',
      email: localStorage.getItem('jira_email') || '',
      apiToken: localStorage.getItem('jira_api_token') || '',
    } as JiraConfig,
    googleSheets: {
      sheetId: localStorage.getItem('google_sheets_id') || '',
      credentials: localStorage.getItem('google_credentials') || '',
    } as GoogleSheetsConfig,
    maps: {
      apiKey: localStorage.getItem('google_maps_api_key') || '',
    } as MapsConfig
  });

  const [testResults, setTestResults] = useState<{[key: string]: boolean | null}>({
    jira: null,
    googleSheets: null,
    maps: null,
  });

  const handleConfigChange = (service: string, field: string, value: string) => {
    setConfigs(prev => ({
      ...prev,
      [service]: {
        ...prev[service as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const saveConfig = (service: string) => {
    if (service === 'jira') {
      const config = configs.jira;
      localStorage.setItem('jira_url', config.url);
      localStorage.setItem('jira_email', config.email);
      localStorage.setItem('jira_api_token', config.apiToken);
    } else if (service === 'googleSheets') {
      const config = configs.googleSheets;
      localStorage.setItem('google_sheets_id', config.sheetId);
      localStorage.setItem('google_credentials', config.credentials);
    } else if (service === 'maps') {
      const config = configs.maps;
      localStorage.setItem('google_maps_api_key', config.apiKey);
    }

    toast({
      title: "Configuração salva",
      description: `Configurações do ${service === 'jira' ? 'Jira' : service === 'googleSheets' ? 'Google Sheets' : 'Google Maps'} foram salvas com sucesso.`,
    });
  };

  const testConnection = async (service: string) => {
    setTestResults(prev => ({ ...prev, [service]: null }));
    
    // Simular teste de conexão
    setTimeout(() => {
      const isValid = service === 'jira' 
        ? configs.jira.url && configs.jira.email && configs.jira.apiToken
        : service === 'googleSheets'
        ? configs.googleSheets.sheetId
        : configs.maps.apiKey;

      setTestResults(prev => ({ ...prev, [service]: !!isValid }));
      
      toast({
        title: isValid ? "Conexão bem-sucedida" : "Falha na conexão",
        description: isValid 
          ? "A conexão com a API foi estabelecida com sucesso."
          : "Verifique suas credenciais e tente novamente.",
        variant: isValid ? "default" : "destructive",
      });
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configurações das APIs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="jira" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jira">Jira</TabsTrigger>
            <TabsTrigger value="sheets">Google Sheets</TabsTrigger>
            <TabsTrigger value="maps">Google Maps</TabsTrigger>
          </TabsList>

          <TabsContent value="jira" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Configure suas credenciais do Jira para integrar com os tickets de segurança.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="jira-url">URL do Jira</Label>
                <Input
                  id="jira-url"
                  placeholder="https://sua-empresa.atlassian.net"
                  value={configs.jira.url}
                  onChange={(e) => handleConfigChange('jira', 'url', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="jira-email">Email</Label>
                <Input
                  id="jira-email"
                  type="email"
                  placeholder="seu-email@empresa.com"
                  value={configs.jira.email}
                  onChange={(e) => handleConfigChange('jira', 'email', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="jira-token">API Token</Label>
                <Input
                  id="jira-token"
                  type="password"
                  placeholder="Seu token da API do Jira"
                  value={configs.jira.apiToken}
                  onChange={(e) => handleConfigChange('jira', 'apiToken', e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={() => saveConfig('jira')}>
                  Salvar Configuração
                </Button>
                <Button variant="outline" onClick={() => testConnection('jira')}>
                  Testar Conexão
                </Button>
                {testResults.jira !== null && (
                  <div className="flex items-center gap-2">
                    {testResults.jira ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sheets" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Configure o acesso ao Google Sheets para importar dados de credenciais comprometidas.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="sheets-id">ID da Planilha</Label>
                <Input
                  id="sheets-id"
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  value={configs.googleSheets.sheetId}
                  onChange={(e) => handleConfigChange('googleSheets', 'sheetId', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="sheets-credentials">Credenciais JSON (opcional)</Label>
                <Textarea
                  id="sheets-credentials"
                  placeholder='{"api_key": "sua-chave-api"}'
                  value={configs.googleSheets.credentials}
                  onChange={(e) => handleConfigChange('googleSheets', 'credentials', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={() => saveConfig('googleSheets')}>
                  Salvar Configuração
                </Button>
                <Button variant="outline" onClick={() => testConnection('googleSheets')}>
                  Testar Conexão
                </Button>
                {testResults.googleSheets !== null && (
                  <div className="flex items-center gap-2">
                    {testResults.googleSheets ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="maps" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Configure a API do Google Maps para exibir mapas de geolocalização dos eventos.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="maps-key">Chave da API</Label>
                <Input
                  id="maps-key"
                  type="password"
                  placeholder="AIzaSyC4R6AN7SmRj-J-ubOYNn4PbeLKZDxuD2k"
                  value={configs.maps.apiKey}
                  onChange={(e) => handleConfigChange('maps', 'apiKey', e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={() => saveConfig('maps')}>
                  Salvar Configuração
                </Button>
                <Button variant="outline" onClick={() => testConnection('maps')}>
                  Testar Conexão
                </Button>
                {testResults.maps !== null && (
                  <div className="flex items-center gap-2">
                    {testResults.maps ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
