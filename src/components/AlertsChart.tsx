import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
const alertsData = [{
  name: 'Mon',
  critical: 4,
  high: 8,
  medium: 12,
  low: 6
}, {
  name: 'Tue',
  critical: 2,
  high: 12,
  medium: 8,
  low: 10
}, {
  name: 'Wed',
  critical: 6,
  high: 6,
  medium: 15,
  low: 8
}, {
  name: 'Thu',
  critical: 3,
  high: 10,
  medium: 11,
  low: 12
}, {
  name: 'Fri',
  critical: 5,
  high: 14,
  medium: 9,
  low: 7
}, {
  name: 'Sat',
  critical: 1,
  high: 4,
  medium: 6,
  low: 5
}, {
  name: 'Sun',
  critical: 2,
  high: 6,
  medium: 8,
  low: 4
}];
const severityData = [{
  name: 'Critical',
  value: 23,
  color: '#ef4444'
}, {
  name: 'High',
  value: 60,
  color: '#f97316'
}, {
  name: 'Medium',
  value: 69,
  color: '#eab308'
}, {
  name: 'Low',
  value: 52,
  color: '#22c55e'
}];
export function AlertsChart() {
  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Alert Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={alertsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }} />
              <Bar dataKey="critical" stackId="a" fill="#ef4444" />
              <Bar dataKey="high" stackId="a" fill="#f97316" />
              <Bar dataKey="medium" stackId="a" fill="#eab308" />
              <Bar dataKey="low" stackId="a" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert Severity Distribution</CardTitle>
        </CardHeader>
        <CardContent className="bg-transparent">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={severityData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {severityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 mt-4">
            {severityData.map(item => <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{
              backgroundColor: item.color
            }} />
                <span className="text-sm text-muted-foreground">
                  {item.name}: {item.value}
                </span>
              </div>)}
          </div>
        </CardContent>
      </Card>
    </div>;
}