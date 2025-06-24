
import { Layout } from "@/components/Layout";
import { KPICard } from "@/components/KPICard";
import { AlertsTable } from "@/components/AlertsTable";
import { Globe, Shield, Activity, AlertTriangle } from "lucide-react";

const WebSecurity = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Web Security
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor web traffic and protect against online threats
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Web Alerts"
            value="89"
            change="+5% from last week"
            changeType="neutral"
            icon={Globe}
            gradient="from-green-500 to-blue-400"
          />
          <KPICard
            title="Blocked Threats"
            value="34"
            change="+7 from yesterday"
            changeType="positive"
            icon={Shield}
            gradient="from-blue-500 to-purple-400"
          />
          <KPICard
            title="Active Sessions"
            value="1,234"
            change="+8% increase"
            changeType="neutral"
            icon={Activity}
            gradient="from-purple-500 to-pink-400"
          />
          <KPICard
            title="Malware Detected"
            value="6"
            change="-2 from yesterday"
            changeType="positive"
            icon={AlertTriangle}
            gradient="from-red-500 to-orange-400"
          />
        </div>

        <AlertsTable />
      </div>
    </Layout>
  );
};

export default WebSecurity;
