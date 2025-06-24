
import { Layout } from "@/components/Layout";
import { KPICard } from "@/components/KPICard";
import { Database, TrendingUp, Users, Calendar } from "lucide-react";

const ThreatIntel = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Inteligência de Ameaças
          </h1>
          <p className="text-muted-foreground mt-2">
            Analise dados de ameaças e feeds de inteligência
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total de Registros"
            value="15,847"
            change="+234 novos hoje"
            changeType="neutral"
            icon={Database}
            gradient="from-purple-500 to-pink-400"
          />
          <KPICard
            title="Ameaças em Tendência"
            value="23"
            change="+5 esta semana"
            changeType="negative"
            icon={TrendingUp}
            gradient="from-red-500 to-pink-400"
          />
          <KPICard
            title="Usuários Afetados"
            value="789"
            change="+12% do mês passado"
            changeType="negative"
            icon={Users}
            gradient="from-orange-500 to-red-400"
          />
          <KPICard
            title="Última Atualização"
            value="2h atrás"
            change="Sincronização automática ativada"
            changeType="positive"
            icon={Calendar}
            gradient="from-green-500 to-blue-400"
          />
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Dados de Inteligência de Ameaças</h3>
          <p className="text-muted-foreground">
            Conecte ao Google Sheets para exibir dados de inteligência de ameaças incluindo credenciais comprometidas e informações de vulnerabilidades.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ThreatIntel;
