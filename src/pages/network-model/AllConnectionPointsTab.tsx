import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const mockNodes = [
  { name: "SFTP Collector A", role: "Collector", type: "SFTP", connectionInfo: "sftp://192.168.1.10:22", status: "connected", lastTransfer: "2025-10-02 14:30:00", transferredSize: "2.4 GB", transferredCount: 15234 },
  { name: "Kafka Producer B", role: "Distributor", type: "Kafka", connectionInfo: "kafka://prod-cluster:9092", status: "connected", lastTransfer: "2025-10-02 14:35:00", transferredSize: "1.8 GB", transferredCount: 12456 },
  { name: "Database Collector C", role: "Collector", type: "Database", connectionInfo: "jdbc:postgresql://db.example.com:5432", status: "alert", lastTransfer: "2025-10-02 14:25:00", transferredSize: "850 MB", transferredCount: 8934 },
  { name: "API Distributor D", role: "Distributor", type: "REST API", connectionInfo: "https://api.example.com/v1", status: "disconnected", lastTransfer: "2025-10-02 13:45:00", transferredSize: "456 MB", transferredCount: 5678 },
  { name: "FTP Collector E", role: "Collector", type: "FTP", connectionInfo: "ftp://ftp.example.com:21", status: "connected", lastTransfer: "2025-10-02 14:32:00", transferredSize: "1.2 GB", transferredCount: 9876 },
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

export function AllConnectionPointsTab() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        Network Model → All Connection Points
      </div>

      {/* Top Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Show Points" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="alerts">With Alerts</SelectItem>
                  <SelectItem value="no-alerts">No Alerts</SelectItem>
                  <SelectItem value="connected">Connected</SelectItem>
                  <SelectItem value="disconnected">Not Connected</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Node Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sftp">SFTP</SelectItem>
                  <SelectItem value="kafka">Kafka</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="api">REST API</SelectItem>
                  <SelectItem value="ftp">FTP</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name or IP..." className="pl-9" />
              </div>

              <Button>Apply Filters</Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Selected
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Selected
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nodes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Points</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>Node Name</TableHead>
                <TableHead>Role / Type</TableHead>
                <TableHead>Connection Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Transfer</TableHead>
                <TableHead>Size / Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockNodes.map((node, index) => (
                <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium">{node.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{node.role}</span>
                      <span className="text-xs text-muted-foreground">{node.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{node.connectionInfo}</TableCell>
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
