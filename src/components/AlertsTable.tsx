
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

const alertsData = [
  {
    id: "SOC-001",
    title: "Suspicious Email Attachment",
    severity: "Critical",
    status: "Open",
    assignee: "John Doe",
    created: "2024-01-15 14:30",
    source: "Email Security"
  },
  {
    id: "SOC-002", 
    title: "Malware Detection on Endpoint",
    severity: "High",
    status: "In Progress",
    assignee: "Jane Smith",
    created: "2024-01-15 13:45",
    source: "Web Security"
  },
  {
    id: "SOC-003",
    title: "Credential Leak Detected",
    severity: "High",
    status: "Open",
    assignee: "Mike Johnson",
    created: "2024-01-15 12:20",
    source: "Threat Intel"
  },
  {
    id: "SOC-004",
    title: "Phishing Attempt Blocked",
    severity: "Medium",
    status: "Resolved",
    assignee: "Sarah Wilson",
    created: "2024-01-15 11:15",
    source: "Email Security"
  },
  {
    id: "SOC-005",
    title: "Unusual Network Traffic",
    severity: "Low",
    status: "In Progress",
    assignee: "Tom Brown",
    created: "2024-01-15 10:30",
    source: "Web Security"
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Critical": return "bg-red-500 hover:bg-red-600";
    case "High": return "bg-orange-500 hover:bg-orange-600";
    case "Medium": return "bg-yellow-500 hover:bg-yellow-600";
    case "Low": return "bg-green-500 hover:bg-green-600";
    default: return "bg-gray-500 hover:bg-gray-600";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Open": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "In Progress": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Resolved": return "bg-green-500/20 text-green-400 border-green-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export function AlertsTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Recent Security Alerts</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search alerts..." 
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-32">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Severity</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Assignee</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Created</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alertsData.map((alert) => (
                <tr key={alert.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <code className="text-sm bg-muted px-2 py-1 rounded">{alert.id}</code>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{alert.title}</div>
                      <div className="text-sm text-muted-foreground">{alert.source}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className={getStatusColor(alert.status)}>
                      {alert.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm">{alert.assignee}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{alert.created}</td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
