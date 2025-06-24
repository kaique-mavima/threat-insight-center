import { Layout } from "@/components/Layout";
import { KPICard } from "@/components/KPICard";
import { ThreatIntelTable } from "@/components/ThreatIntelTable";
import { GeoMap } from "@/components/GeoMap";
import { Database, TrendingUp, Users, Calendar } from "lucide-react";
const ThreatIntel = () => {
  return <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-slate-50">Credenciais</h1>
          <p className="text-muted-foreground mt-2">
            Analise dados de ameaças, credenciais comprometidas e feeds de inteligência
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard title="Credenciais Comprometidas" value="15,847" change="+234 novas hoje" changeType="negative" icon={Database} gradient="from-purple-500 to-pink-400" />
          <KPICard title="Ameaças em Tendência" value="23" change="+5 esta semana" changeType="negative" icon={TrendingUp} gradient="from-red-500 to-pink-400" />
          <KPICard title="Domínios Afetados" value="89" change="+12% do mês passado" changeType="negative" icon={Users} gradient="from-orange-500 to-red-400" />
          <KPICard title="Última Sincronização" value="2h atrás" change="Google Sheets conectado" changeType="positive" icon={Calendar} gradient="from-green-500 to-blue-400" />
        </div>

        {/* Mapa de Geolocalização */}
        <GeoMap />

        {/* Tabela de Credenciais Comprometidas */}
        <ThreatIntelTable />
      </div>
    </Layout>;
};
export default ThreatIntel;