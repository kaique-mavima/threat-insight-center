
import { Layout } from "@/components/Layout";
import { KPICard } from "@/components/KPICard";
import { Activity, FileText, AlertCircle, Clock } from "lucide-react";

const Logs = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Logs de Atividade
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitore atividades do sistema e ações dos usuários
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total de Eventos"
            value="2,847"
            change="+156 hoje"
            changeType="neutral"
            icon={Activity}
            gradient="from-cyan-500 to-blue-400"
          />
          <KPICard
            title="Arquivos de Log"
            value="24"
            change="Monitoramento ativo"
            changeType="positive"
            icon={FileText}
            gradient="from-blue-500 to-indigo-400"
          />
          <KPICard
            title="Eventos Críticos"
            value="3"
            change="+1 na última hora"
            changeType="negative"
            icon={AlertCircle}
            gradient="from-red-500 to-pink-400"
          />
          <KPICard
            title="Retenção"
            value="90 dias"
            change="Arquivamento automático ativado"
            changeType="positive"
            icon={Clock}
            gradient="from-green-500 to-emerald-400"
          />
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Logs de Atividade do Sistema</h3>
          <p className="text-muted-foreground">
            Logs detalhados de atividade e trilhas de auditoria serão exibidos aqui, incluindo ações de usuários, eventos do sistema e incidentes de segurança.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Logs;
