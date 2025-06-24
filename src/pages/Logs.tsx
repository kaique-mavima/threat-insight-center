
import { Layout } from "@/components/Layout";
import { KPICard } from "@/components/KPICard";
import { Activity, FileText, AlertCircle, Clock } from "lucide-react";

const Logs = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Activity Logs
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor system activities and user actions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Events"
            value="2,847"
            change="+156 today"
            changeType="neutral"
            icon={Activity}
            gradient="from-cyan-500 to-blue-400"
          />
          <KPICard
            title="Log Files"
            value="24"
            change="Active monitoring"
            changeType="positive"
            icon={FileText}
            gradient="from-blue-500 to-indigo-400"
          />
          <KPICard
            title="Critical Events"
            value="3"
            change="+1 in last hour"
            changeType="negative"
            icon={AlertCircle}
            gradient="from-red-500 to-pink-400"
          />
          <KPICard
            title="Retention"
            value="90 days"
            change="Auto-archive enabled"
            changeType="positive"
            icon={Clock}
            gradient="from-green-500 to-emerald-400"
          />
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">System Activity Logs</h3>
          <p className="text-muted-foreground">
            Detailed activity logs and audit trails will be displayed here, including user actions, system events, and security incidents.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Logs;
