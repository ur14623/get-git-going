import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockRejectedStreams = [
  { streamName: "Charging Stream 1", dataSource: "SFTP Server A", rejectionType: "Format Error", rejectedCount: 23, fetchSource: "/data/charging/raw", timestamp: "2025-10-02 14:30:00" },
  { streamName: "Convergent Stream", dataSource: "Database B", rejectionType: "Validation Failed", rejectedCount: 12, fetchSource: "db://convergent/input", timestamp: "2025-10-02 14:25:00" },
  { streamName: "NCC Stream", dataSource: "Kafka Topic", rejectionType: "Schema Mismatch", rejectedCount: 8, fetchSource: "kafka://ncc-topic", timestamp: "2025-10-02 14:20:00" },
  { streamName: "Data Stream 4", dataSource: "API Endpoint", rejectionType: "Timeout", rejectedCount: 5, fetchSource: "https://api.example.com/data", timestamp: "2025-10-02 14:15:00" },
];

export function RejectedDataTab() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        Data Monitoring → Rejected Data
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Most Common Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Format Error</div>
            <p className="text-xs text-muted-foreground mt-1">23 occurrences</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-destructive" />
              <span className="text-2xl font-bold">+15%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs. last week</p>
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
                <SelectValue placeholder="Select Stream" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Streams</SelectItem>
                <SelectItem value="charging">Charging Stream</SelectItem>
                <SelectItem value="convergent">Convergent Stream</SelectItem>
                <SelectItem value="ncc">NCC Stream</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Rejection Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="format">Format Error</SelectItem>
                <SelectItem value="validation">Validation Failed</SelectItem>
                <SelectItem value="schema">Schema Mismatch</SelectItem>
                <SelectItem value="timeout">Timeout</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last 1 Hour</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>

            <Button>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Rejected Streams Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rejected Data</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stream Name</TableHead>
                <TableHead>Data Source</TableHead>
                <TableHead>Rejection Type</TableHead>
                <TableHead>Rejected Count</TableHead>
                <TableHead>Fetch Source</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRejectedStreams.map((stream, index) => (
                <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{stream.streamName}</TableCell>
                  <TableCell>{stream.dataSource}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{stream.rejectionType}</Badge>
                  </TableCell>
                  <TableCell>{stream.rejectedCount}</TableCell>
                  <TableCell className="font-mono text-xs">{stream.fetchSource}</TableCell>
                  <TableCell>{stream.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
