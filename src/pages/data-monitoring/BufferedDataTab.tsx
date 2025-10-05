import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const mockBufferedData = [
  { streamName: "Charging Stream 1", bufferName: "Main Buffer", target: "Processing Queue", bufferType: "Memory", status: "normal", currentRecords: 1245, totalRecords: 5000, bufferSize: "12.4 MB", lastUpdated: "2025-10-02 14:35:00" },
  { streamName: "Convergent Stream", bufferName: "Retry Buffer", target: "Error Handler", bufferType: "Disk", status: "warning", currentRecords: 4523, totalRecords: 5000, bufferSize: "45.2 MB", lastUpdated: "2025-10-02 14:33:00" },
  { streamName: "NCC Stream", bufferName: "Temp Buffer", target: "Archive Storage", bufferType: "Memory", status: "empty", currentRecords: 0, totalRecords: 10000, bufferSize: "0 MB", lastUpdated: "2025-10-02 14:30:00" },
  { streamName: "Data Stream 4", bufferName: "Overflow Buffer", target: "Secondary Processing", bufferType: "Disk", status: "critical", currentRecords: 9856, totalRecords: 10000, bufferSize: "98.5 MB", lastUpdated: "2025-10-02 14:36:00" },
];

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: "default" | "destructive" | "secondary" | "outline", label: string }> = {
    normal: { variant: "default", label: "Normal" },
    warning: { variant: "secondary", label: "Warning" },
    critical: { variant: "destructive", label: "Critical" },
    empty: { variant: "outline", label: "Empty" },
  };
  const config = variants[status] || variants.normal;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export function BufferedDataTab() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        Data Monitoring → Buffered Data
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Buffers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">Active buffers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.6K</div>
            <p className="text-xs text-muted-foreground mt-1">Buffered records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156 MB</div>
            <p className="text-xs text-muted-foreground mt-1">Buffer size</p>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              Critical Buffers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">Near capacity</p>
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
                <SelectValue placeholder="Buffer Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="memory">Memory</SelectItem>
                <SelectItem value="disk">Disk</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="empty">Empty</SelectItem>
              </SelectContent>
            </Select>

            <Button>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Buffered Data Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Buffered Data</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stream Name</TableHead>
                <TableHead>Buffer Name</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBufferedData.map((buffer, index) => {
                const percentage = (buffer.currentRecords / buffer.totalRecords) * 100;
                return (
                  <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{buffer.streamName}</TableCell>
                    <TableCell>{buffer.bufferName}</TableCell>
                    <TableCell>{buffer.target}</TableCell>
                    <TableCell>{buffer.bufferType}</TableCell>
                    <TableCell>{getStatusBadge(buffer.status)}</TableCell>
                    <TableCell>{buffer.currentRecords.toLocaleString()} / {buffer.totalRecords.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={percentage} className="h-2" />
                        <span className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{buffer.bufferSize}</TableCell>
                    <TableCell className="text-xs">{buffer.lastUpdated}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
