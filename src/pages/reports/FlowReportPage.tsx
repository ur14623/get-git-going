import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, TrendingUp, TrendingDown, Activity } from "lucide-react";

export function FlowReportPage() {
  const reports = [
    {
      id: 1,
      flowName: "SFTP Data Collection",
      executionCount: 1250,
      successRate: 98.4,
      avgExecutionTime: "2.3 minutes",
      lastExecution: "2025-08-21 11:45:00",
      status: "healthy",
      trend: "up"
    },
    {
      id: 2,
      flowName: "Data Validation Pipeline",
      executionCount: 890,
      successRate: 94.2,
      avgExecutionTime: "4.1 minutes",
      lastExecution: "2025-08-21 11:30:00",
      status: "warning",
      trend: "down"
    },
    {
      id: 3,
      flowName: "Billing Data Processing",
      executionCount: 567,
      successRate: 99.1,
      avgExecutionTime: "1.8 minutes",
      lastExecution: "2025-08-21 11:15:00",
      status: "healthy",
      trend: "stable"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-success text-success-foreground';
      case 'warning': return 'bg-secondary text-secondary-foreground';
      case 'error': return 'bg-destructive text-destructive-foreground';
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
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Flow Reports</h1>
          <p className="text-muted-foreground">Comprehensive flow execution analytics and performance metrics</p>
        </div>
      </div>

      <div className="grid gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="border border-border">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{report.flowName}</CardTitle>
                  <CardDescription>Last executed: {report.lastExecution}</CardDescription>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Executions</p>
                  <p className="text-2xl font-bold text-foreground">{report.executionCount.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-success">{report.successRate}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Avg Execution Time</p>
                  <p className="text-2xl font-bold text-foreground">{report.avgExecutionTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}