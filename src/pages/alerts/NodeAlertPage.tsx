import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, CheckCircle, XCircle } from "lucide-react";

export function NodeAlertPage() {
  const alerts = [
    {
      id: 1,
      nodeName: "SFTP Collector",
      nodeVersion: "v1.2.0",
      alertType: "Error",
      message: "Failed to connect to SFTP server after 3 retry attempts",
      severity: "high",
      timestamp: "2025-08-21 11:15:00",
      status: "active"
    },
    {
      id: 2,
      nodeName: "Data Validator",
      nodeVersion: "v2.1.0",
      alertType: "Warning",
      message: "Memory usage exceeded 80% threshold",
      severity: "medium",
      timestamp: "2025-08-21 10:45:00",
      status: "acknowledged"
    },
    {
      id: 3,
      nodeName: "ASN.1 Decoder",
      nodeVersion: "v1.0.5",
      alertType: "Performance",
      message: "Processing time increased by 25% compared to baseline",
      severity: "low",
      timestamp: "2025-08-21 09:30:00",
      status: "monitoring"
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
      case 'monitoring': return <Bell className="h-4 w-4 text-primary" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-success" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Node Alerts</h1>
          <p className="text-muted-foreground">Monitor node performance and health alerts</p>
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
                    <CardTitle className="text-lg">{alert.nodeName}</CardTitle>
                    <CardDescription>{alert.nodeVersion} • {alert.alertType}</CardDescription>
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