import { Layout } from "@/components/Layout";
import { KPICard } from "@/components/KPICard";
import { AlertsTable } from "@/components/AlertsTable";
import { Globe, Shield, Activity, AlertTriangle } from "lucide-react";
const WebSecurity = () => {
  return <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-slate-50">Monitoramento Web</h1>
          <p className="text-muted-foreground mt-2">
            Monitore o tráfego web e proteja contra ameaças online
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard title="Alertas Web" value="89" change="+5% em relação à semana passada" changeType="neutral" icon={Globe} gradient="from-green-500 to-blue-400" />
          <KPICard title="Ameaças Bloqueadas" value="34" change="+7 desde ontem" changeType="positive" icon={Shield} gradient="from-blue-500 to-purple-400" />
          <KPICard title="Sessões Ativas" value="1,234" change="+8% de aumento" changeType="neutral" icon={Activity} gradient="from-purple-500 to-pink-400" />
          <KPICard title="Malware Detectado" value="6" change="-2 desde ontem" changeType="positive" icon={AlertTriangle} gradient="from-red-500 to-orange-400" />
        </div>

        <AlertsTable />
      </div>
    </Layout>;
};
export default WebSecurity;