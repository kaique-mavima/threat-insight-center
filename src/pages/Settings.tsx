import { Layout } from "@/components/Layout";
import { ApiConfigForm } from "@/components/ApiConfigForm";
import { NotificationIntegrations } from "@/components/NotificationIntegrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";
const Settings = () => {
  return <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-slate-50">
            Configurações
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure integrações e personalize seu Threat Insight Center
          </p>
        </div>

        {/* Configurações das APIs */}
        <ApiConfigForm />

        {/* Integrações de Notificações */}
        <NotificationIntegrations />

        {/* Informações do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Informações do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Versão</h4>
                <p className="text-lg font-semibold">SIC Dashboard v2.0</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Última Atualização</h4>
                <p className="text-lg font-semibold">24 Jun 2025</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Integrações Ativas</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Jira API</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Google Sheets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm">Google Maps (Configurar)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm">Notificações (Slack, Teams, Telegram)</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Status do Sistema</h4>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-semibold text-green-600">Operacional</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>;
};
export default Settings;