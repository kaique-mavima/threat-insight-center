
import { Layout } from "@/components/Layout";
import { KPICard } from "@/components/KPICard";
import { Database, TrendingUp, Users, Calendar } from "lucide-react";

const ThreatIntel = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Threat Intelligence
          </h1>
          <p className="text-muted-foreground mt-2">
            Analyze threat data and intelligence feeds
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Records"
            value="15,847"
            change="+234 new today"
            changeType="neutral"
            icon={Database}
            gradient="from-purple-500 to-pink-400"
          />
          <KPICard
            title="Trending Threats"
            value="23"
            change="+5 this week"
            changeType="negative"
            icon={TrendingUp}
            gradient="from-red-500 to-pink-400"
          />
          <KPICard
            title="Affected Users"
            value="789"
            change="+12% from last month"
            changeType="negative"
            icon={Users}
            gradient="from-orange-500 to-red-400"
          />
          <KPICard
            title="Last Update"
            value="2h ago"
            change="Auto-sync enabled"
            changeType="positive"
            icon={Calendar}
            gradient="from-green-500 to-blue-400"
          />
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Threat Intelligence Data</h3>
          <p className="text-muted-foreground">
            Connect to Google Sheets to display threat intelligence data including breached credentials and vulnerability information.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ThreatIntel;
