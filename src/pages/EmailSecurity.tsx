
import { Layout } from "@/components/Layout";
import { KPICard } from "@/components/KPICard";
import { AlertsTable } from "@/components/AlertsTable";
import { Mail, AlertTriangle, Clock, CheckCircle } from "lucide-react";

const EmailSecurity = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Segurança de Email
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitore e responda a ameaças baseadas em email
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Alertas de Email"
            value="47"
            change="+8% em relação à semana passada"
            changeType="neutral"
            icon={Mail}
            gradient="from-blue-500 to-cyan-400"
          />
          <KPICard
            title="Tentativas de Phishing"
            value="12"
            change="+3 desde ontem"
            changeType="negative"
            icon={AlertTriangle}
            gradient="from-red-500 to-pink-400"
          />
          <KPICard
            title="Tempo Médio de Resposta"
            value="8m"
            change="-15% de melhoria"
            changeType="positive"
            icon={Clock}
            gradient="from-orange-500 to-yellow-400"
          />
          <KPICard
            title="Emails Bloqueados"
            value="156"
            change="+12% vs ontem"
            changeType="positive"
            icon={CheckCircle}
            gradient="from-green-500 to-emerald-400"
          />
        </div>

        <AlertsTable />
      </div>
    </Layout>
  );
};

export default EmailSecurity;
