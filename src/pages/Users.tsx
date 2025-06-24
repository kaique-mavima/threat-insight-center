
import { Layout } from "@/components/Layout";
import { KPICard } from "@/components/KPICard";
import { Users as UsersIcon, UserCheck, UserX, Clock } from "lucide-react";

const Users = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts and access permissions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Users"
            value="47"
            change="+3 new this month"
            changeType="neutral"
            icon={UsersIcon}
            gradient="from-indigo-500 to-purple-400"
          />
          <KPICard
            title="Active Users"
            value="42"
            change="89% online rate"
            changeType="positive"
            icon={UserCheck}
            gradient="from-green-500 to-emerald-400"
          />
          <KPICard
            title="Inactive Users"
            value="5"
            change="11% of total"
            changeType="neutral"
            icon={UserX}
            gradient="from-orange-500 to-red-400"
          />
          <KPICard
            title="Last Login"
            value="5m ago"
            change="Real-time monitoring"
            changeType="positive"
            icon={Clock}
            gradient="from-blue-500 to-cyan-400"
          />
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">User Management Panel</h3>
          <p className="text-muted-foreground">
            User management functionality will be implemented here, including user creation, role assignment, and access control.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
