
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const alertsData = [
  {
    name: 'Seg',
    critical: 4,
    high: 8,
    medium: 12,
    low: 6
  },
  {
    name: 'Ter',
    critical: 2,
    high: 12,
    medium: 8,
    low: 10
  },
  {
    name: 'Qua',
    critical: 6,
    high: 6,
    medium: 15,
    low: 8
  },
  {
    name: 'Qui',
    critical: 3,
    high: 10,
    medium: 11,
    low: 12
  },
  {
    name: 'Sex',
    critical: 5,
    high: 14,
    medium: 9,
    low: 7
  },
  {
    name: 'Sáb',
    critical: 1,
    high: 4,
    medium: 6,
    low: 5
  },
  {
    name: 'Dom',
    critical: 2,
    high: 6,
    medium: 8,
    low: 4
  }
];

const severityData = [
  {
    name: 'Crítico',
    value: 23,
    color: '#ef4444'
  },
  {
    name: 'Alto',
    value: 60,
    color: '#f97316'
  },
  {
    name: 'Médio',
    value: 69,
    color: '#eab308'
  },
  {
    name: 'Baixo',
    value: 52,
    color: '#22c55e'
  }
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const severity = data.name;
    let textColor = '#ffffff';
    
    // Define text color based on severity
    switch (severity) {
      case 'Crítico':
        textColor = '#ffffff';
        break;
      case 'Alto':
        textColor = '#ffffff';
        break;
      case 'Médio':
        textColor = '#000000';
        break;
      case 'Baixo':
        textColor = '#ffffff';
        break;
      default:
        textColor = '#ffffff';
    }

    return (
      <div 
        className="p-3 rounded-lg border border-border shadow-lg"
        style={{ 
          backgroundColor: data.payload.color,
          color: textColor
        }}
      >
        <p className="font-medium">{`${severity}: ${data.value}`}</p>
      </div>
    );
  }
  return null;
};

export function AlertsChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Tendências Semanais de Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={alertsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
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
          <CardTitle>Distribuição de Severidade dos Alertas</CardTitle>
        </CardHeader>
        <CardContent className="bg-transparent">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 mt-4">
            {severityData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
