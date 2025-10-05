import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockRecords = [
  { recordType: "Usage", action: "INSERT", serviceType: "Voice", status: "success", count: 1243, subscriberCount: 856, bundleName: "Voice Bundle A" },
  { recordType: "Charge", action: "UPDATE", serviceType: "Data", status: "success", count: 932, subscriberCount: 654, bundleName: "Data Bundle B" },
  { recordType: "Balance", action: "INSERT", serviceType: "SMS", status: "pending", count: 445, subscriberCount: 332, bundleName: "SMS Bundle C" },
  { recordType: "Usage", action: "DELETE", serviceType: "Voice", status: "failed", count: 23, subscriberCount: 18, bundleName: "Voice Bundle D" },
];

export function LookupDataTab() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        Data Monitoring → Lookup Data
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Stream" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="charging">Charging Stream</SelectItem>
                <SelectItem value="convergent">Convergent Stream</SelectItem>
                <SelectItem value="ncc">NCC Stream</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Record Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usage">Usage</SelectItem>
                <SelectItem value="charge">Charge</SelectItem>
                <SelectItem value="balance">Balance</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="insert">INSERT</SelectItem>
                <SelectItem value="update">UPDATE</SelectItem>
                <SelectItem value="delete">DELETE</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search records..." className="pl-9" />
            </div>

            <Button className="md:col-span-2 lg:col-span-1">
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lookup Results</CardTitle>
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
                <TableHead>Record Type</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Subscriber Count</TableHead>
                <TableHead>Bundle Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRecords.map((record, index) => (
                <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{record.recordType}</TableCell>
                  <TableCell>{record.action}</TableCell>
                  <TableCell>{record.serviceType}</TableCell>
                  <TableCell>
                    <Badge variant={record.status === "success" ? "default" : record.status === "pending" ? "secondary" : "destructive"}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.count}</TableCell>
                  <TableCell>{record.subscriberCount}</TableCell>
                  <TableCell>{record.bundleName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
