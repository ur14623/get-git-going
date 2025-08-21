import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown, Activity, Cpu } from "lucide-react";

export function NodeReportPage() {
  const reports = [
    {
      id: 1,
      nodeName: "SFTP Collector",
      version: "v1.2.0",
      executionCount: 2450,
      successRate: 97.8,
      avgProcessingTime: "45 seconds",
      memoryUsage: "512 MB",
      cpuUsage: "23%",
      lastUsed: "2025-08-21 11:50:00",
      status: "optimal",
      trend: "up"
    },
    {
      id: 2,
      nodeName: "Data Validator",
      version: "v2.1.0",
      executionCount: 1890,
      successRate: 92.5,
      avgProcessingTime: "1.2 minutes",
      memoryUsage: "768 MB",
      cpuUsage: "45%",
      lastUsed: "2025-08-21 11:35:00",
      status: "warning",
      trend: "down"
    },
    {
      id: 3,
      nodeName: "ASN.1 Decoder",
      version: "v1.0.5",
      executionCount: 3200,
      successRate: 99.2,
      avgProcessingTime: "30 seconds",
      memoryUsage: "256 MB",
      cpuUsage: "18%",
      lastUsed: "2025-08-21 11:40:00",
      status: "optimal",
      trend: "stable"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-success text-success-foreground';
      case 'warning': return 'bg-secondary text-secondary-foreground';
      case 'critical': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-destructive" />;
      case 'stable': return <Activity className="h-4 w-4 text-muted-foreground" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Node Reports</h1>
          <p className="text-muted-foreground">Detailed node performance metrics and resource utilization</p>
        </div>
      </div>

      <div className="grid gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="border border-border">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{report.nodeName}</CardTitle>
                  <CardDescription>{report.version} • Last used: {report.lastUsed}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(report.status)}>
                    {report.status.toUpperCase()}
                  </Badge>
                  {getTrendIcon(report.trend)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Executions</p>
                  <p className="text-lg font-bold text-foreground">{report.executionCount.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-lg font-bold text-success">{report.successRate}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Avg Time</p>
                  <p className="text-lg font-bold text-foreground">{report.avgProcessingTime}</p>
                </div>
                <div className="space-y-1 flex items-center gap-1">
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">CPU</p>
                    <p className="text-lg font-bold text-foreground">{report.cpuUsage}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Memory</p>
                  <p className="text-lg font-bold text-foreground">{report.memoryUsage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}