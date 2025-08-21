import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react";

export function FlowAlertPage() {
  const alerts = [
    {
      id: 1,
      flowName: "SFTP Data Collection",
      alertType: "Error",
      message: "Connection timeout while collecting CDR files",
      severity: "high",
      timestamp: "2025-08-21 10:30:00",
      status: "active"
    },
    {
      id: 2,
      flowName: "Data Validation Pipeline",
      alertType: "Warning",
      message: "Data validation failed for 12 records",
      severity: "medium",
      timestamp: "2025-08-21 09:15:00",
      status: "acknowledged"
    },
    {
      id: 3,
      flowName: "Billing Data Processing",
      alertType: "Info",
      message: "Processing completed successfully",
      severity: "low",
      timestamp: "2025-08-21 08:45:00",
      status: "resolved"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-secondary text-secondary-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'acknowledged': return <Clock className="h-4 w-4 text-secondary" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-success" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Flow Alerts</h1>
          <p className="text-muted-foreground">Monitor flow execution alerts and issues</p>
        </div>
      </div>

      <div className="grid gap-4">
        {alerts.map((alert) => (
          <Card key={alert.id} className="border border-border">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(alert.status)}
                  <div>
                    <CardTitle className="text-lg">{alert.flowName}</CardTitle>
                    <CardDescription>{alert.alertType}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">{alert.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-2">{alert.message}</p>
              <p className="text-sm text-muted-foreground">{alert.timestamp}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}