
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
            Email Security
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and respond to email-based security threats
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Email Alerts"
            value="47"
            change="+8% from last week"
            changeType="neutral"
            icon={Mail}
            gradient="from-blue-500 to-cyan-400"
          />
          <KPICard
            title="Phishing Attempts"
            value="12"
            change="+3 from yesterday"
            changeType="negative"
            icon={AlertTriangle}
            gradient="from-red-500 to-pink-400"
          />
          <KPICard
            title="Avg Response Time"
            value="8m"
            change="-15% improvement"
            changeType="positive"
            icon={Clock}
            gradient="from-orange-500 to-yellow-400"
          />
          <KPICard
            title="Blocked Emails"
            value="156"
            change="+12% vs yesterday"
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
