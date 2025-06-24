
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter, Calendar, User, Tag } from "lucide-react";
import { useState } from "react";

const alertsData = [
  {
    id: "SOC-001",
    title: "Suspicious Email Attachment",
    description: "Detected a suspicious email attachment with potential malware. The file 'invoice.pdf.exe' was flagged by our security scanners as containing malicious code. Immediate investigation required.",
    severity: "Critical",
    status: "Open",
    assignee: "John Doe",
    created: "2024-01-15 14:30",
    source: "Email Security"
  },
  {
    id: "SOC-002", 
    title: "Malware Detection on Endpoint",
    description: "Endpoint protection detected malware on workstation WS-001. The threat was quarantined but manual verification is needed to ensure complete removal.",
    severity: "High",
    status: "In Progress",
    assignee: "Jane Smith",
    created: "2024-01-15 13:45",
    source: "Web Security"
  },
  {
    id: "SOC-003",
    title: "Credential Leak Detected",
    description: "Multiple user credentials found in a recent data breach. Affected users need to be notified and passwords reset immediately.",
    severity: "High",
    status: "Open",
    assignee: "Mike Johnson",
    created: "2024-01-15 12:20",
    source: "Threat Intel"
  },
  {
    id: "SOC-004",
    title: "Phishing Attempt Blocked",
    description: "Automated systems blocked a phishing attempt targeting finance department. Email contained fraudulent invoice with malicious links.",
    severity: "Medium",
    status: "Resolved",
    assignee: "Sarah Wilson",
    created: "2024-01-15 11:15",
    source: "Email Security"
  },
  {
    id: "SOC-005",
    title: "Unusual Network Traffic",
    description: "Detected unusual network traffic patterns suggesting potential data exfiltration. Traffic analysis shows large data transfers to unknown external IPs.",
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
  const [selectedAlert, setSelectedAlert] = useState<typeof alertsData[0] | null>(null);

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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedAlert(alert)}>
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            {alert.title}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Alert ID</div>
                              <code className="bg-muted px-2 py-1 rounded text-sm">{alert.id}</code>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Source</div>
                              <div className="text-sm">{alert.source}</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Severity</div>
                              <Badge className={getSeverityColor(alert.severity)}>
                                {alert.severity}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Status</div>
                              <Badge variant="outline" className={getStatusColor(alert.status)}>
                                {alert.status}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <User className="w-3 h-3" />
                                Assignee
                              </div>
                              <div className="text-sm">{alert.assignee}</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Created
                            </div>
                            <div className="text-sm">{alert.created}</div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Description</div>
                            <div className="text-sm bg-muted/50 p-3 rounded-md">
                              {alert.description}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button size="sm">Edit Alert</Button>
                            <Button variant="outline" size="sm">Add Comment</Button>
                            <Button variant="outline" size="sm">Change Status</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
