import { Layout } from "@/components/Layout";
import { KPICard } from "@/components/KPICard";
import { AlertsChart } from "@/components/AlertsChart";
import { AlertsTable } from "@/components/AlertsTable";
import { Shield, AlertTriangle, Clock, CheckCircle, Activity } from "lucide-react";
const Index = () => {
  return <Layout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-center text-slate-50 font-bold">SIC Insights</h1>
          <p className="text-muted-foreground mt-2">
            Monitore, analise e responda a ameaças de segurança em tempo real
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard title="Total de Alertas" value="204" change="+12% em relação à semana passada" changeType="neutral" icon={Shield} gradient="from-blue-500 to-cyan-400" />
          <KPICard title="Alertas Críticos" value="23" change="+5 desde ontem" changeType="negative" icon={AlertTriangle} gradient="from-red-500 to-pink-400" />
          <KPICard title="Tempo Médio de Resposta" value="14m" change="-8% de melhoria" changeType="positive" icon={Clock} gradient="from-orange-500 to-yellow-400" />
          <KPICard title="Resolvidos Hoje" value="89" change="+23% vs ontem" changeType="positive" icon={CheckCircle} gradient="from-green-500 to-emerald-400" />
        </div>

        {/* Charts Section */}
        <AlertsChart />

        {/* System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg p-6 border border-border px-[24px]">
              <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm">Alerta crítico: Anexo de email suspeito detectado</p>
                    <p className="text-xs text-muted-foreground">2 minutos atrás</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm">Alerta resolvido: Tentativa de phishing bloqueada</p>
                    <p className="text-xs text-muted-foreground">15 minutos atrás</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm">Novos dados de inteligência de ameaças importados</p>
                    <p className="text-xs text-muted-foreground">1 hora atrás</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm">Usuário logou: admin@empresa.com</p>
                    <p className="text-xs text-muted-foreground">2 horas atrás</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Table */}
        <AlertsTable />
      </div>
    </Layout>;
};
export default Index;