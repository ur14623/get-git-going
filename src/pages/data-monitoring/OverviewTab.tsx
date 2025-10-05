import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockStreams = [
  { name: "Charging Stream 1", status: "running", throughput: "1.2K/s", rejectedRecords: 5 },
  { name: "Convergent Stream", status: "running-alerts", throughput: "850/s", rejectedRecords: 23 },
  { name: "NCC Stream", status: "partial", throughput: "450/s", rejectedRecords: 12 },
  { name: "Data Stream 4", status: "stopped", throughput: "0/s", rejectedRecords: 0 },
];

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: "default" | "destructive" | "secondary" | "outline", label: string }> = {
    running: { variant: "default", label: "Running Correctly" },
    "running-alerts": { variant: "secondary", label: "Running with Alerts" },
    partial: { variant: "outline", label: "Partial" },
    stopped: { variant: "destructive", label: "Stopped" },
  };
  const config = variants[status] || variants.running;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Throughput</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5K/s</div>
            <p className="text-xs text-muted-foreground mt-1">Records per second</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">40</div>
            <p className="text-xs text-muted-foreground mt-1">In last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Streams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3/4</div>
            <p className="text-xs text-muted-foreground mt-1">Streams running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground mt-1">Overall health score</p>
          </CardContent>
        </Card>
      </div>

      {/* Streams Table */}
      <Card>
        <CardHeader>
          <CardTitle>Streams Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  Stream Name
                  <Button variant="ghost" size="sm" className="ml-2 h-4 w-4 p-0">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  Throughput
                  <Button variant="ghost" size="sm" className="ml-2 h-4 w-4 p-0">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  Rejected Records
                  <Button variant="ghost" size="sm" className="ml-2 h-4 w-4 p-0">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStreams.map((stream, index) => (
                <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{stream.name}</TableCell>
                  <TableCell>{getStatusBadge(stream.status)}</TableCell>
                  <TableCell>{stream.throughput}</TableCell>
                  <TableCell>{stream.rejectedRecords}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
