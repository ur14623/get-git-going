import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download } from "lucide-react";

const mockOutgoingNodes = [
  { name: "Kafka Producer B", type: "Kafka Distributor", connectionInfo: "kafka://prod-cluster:9092", target: "Analytics Platform", status: "connected", lastTransfer: "2025-10-02 14:35:00", transferredSize: "1.8 GB", transferredCount: 12456 },
  { name: "API Distributor D", type: "REST API", connectionInfo: "https://api.example.com/v1", target: "Partner API", status: "disconnected", lastTransfer: "2025-10-02 13:45:00", transferredSize: "456 MB", transferredCount: 5678 },
  { name: "SFTP Distributor G", type: "SFTP Outgoing", connectionInfo: "sftp://remote.example.com:22", target: "External Archive", status: "connected", lastTransfer: "2025-10-02 14:34:00", transferredSize: "3.2 GB", transferredCount: 18765 },
  { name: "Database Writer H", type: "DB Distributor", connectionInfo: "jdbc:mysql://warehouse.example.com:3306", target: "Data Warehouse", status: "connected", lastTransfer: "2025-10-02 14:36:00", transferredSize: "2.1 GB", transferredCount: 14532 },
];

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: "default" | "destructive" | "secondary", label: string }> = {
    connected: { variant: "default", label: "Connected" },
    alert: { variant: "secondary", label: "Alert" },
    disconnected: { variant: "destructive", label: "Disconnected" },
  };
  const config = variants[status] || variants.connected;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export function OutgoingConnectionPointsTab() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        Network Model → Outgoing Connection Points
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Outgoing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">Active distributors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Data Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.5 GB</div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Connected Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3/4</div>
            <p className="text-xs text-muted-foreground mt-1">Healthy connections</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Show Points" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="alerts">With Alerts</SelectItem>
                <SelectItem value="connected">Connected</SelectItem>
                <SelectItem value="disconnected">Disconnected</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Node Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="kafka">Kafka Distributor</SelectItem>
                <SelectItem value="api">REST API</SelectItem>
                <SelectItem value="sftp">SFTP Outgoing</SelectItem>
                <SelectItem value="db">DB Distributor</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9" />
            </div>

            <Button>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Outgoing Nodes Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Outgoing Connection Points</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Node Name</TableHead>
                <TableHead>Node Type</TableHead>
                <TableHead>Connection Info</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Transfer</TableHead>
                <TableHead>Size / Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOutgoingNodes.map((node, index) => (
                <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{node.name}</TableCell>
                  <TableCell>{node.type}</TableCell>
                  <TableCell className="font-mono text-xs">{node.connectionInfo}</TableCell>
                  <TableCell>{node.target}</TableCell>
                  <TableCell>{getStatusBadge(node.status)}</TableCell>
                  <TableCell>{node.lastTransfer}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{node.transferredSize}</span>
                      <span className="text-xs text-muted-foreground">{node.transferredCount.toLocaleString()} records</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
