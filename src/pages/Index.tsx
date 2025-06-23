
import { Layout } from "@/components/Layout";
import { KPICard } from "@/components/KPICard";
import { AlertsChart } from "@/components/AlertsChart";
import { AlertsTable } from "@/components/AlertsTable";
import { Shield, AlertTriangle, Clock, CheckCircle, Activity } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Security Operations Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor, analyze, and respond to security threats in real-time
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Alerts"
            value="204"
            change="+12% from last week"
            changeType="neutral"
            icon={Shield}
            gradient="from-blue-500 to-cyan-400"
          />
          <KPICard
            title="Critical Alerts"
            value="23"
            change="+5 from yesterday"
            changeType="negative"
            icon={AlertTriangle}
            gradient="from-red-500 to-pink-400"
          />
          <KPICard
            title="Avg Response Time"
            value="14m"
            change="-8% improvement"
            changeType="positive"
            icon={Clock}
            gradient="from-orange-500 to-yellow-400"
          />
          <KPICard
            title="Resolved Today"
            value="89"
            change="+23% vs yesterday"
            changeType="positive"
            icon={CheckCircle}
            gradient="from-green-500 to-emerald-400"
          />
        </div>

        {/* Charts Section */}
        <AlertsChart />

        {/* System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                System Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Security</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Web Security</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Threat Intel</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-yellow-400">Updating</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">JIRA Integration</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400">Connected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm">Critical alert: Suspicious email attachment detected</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm">Alert resolved: Phishing attempt blocked</p>
                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm">New threat intelligence data imported</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm">User logged in: admin@company.com</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Table */}
        <AlertsTable />
      </div>
    </Layout>
  );
};

export default Index;
