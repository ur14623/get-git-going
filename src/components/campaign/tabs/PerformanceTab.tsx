import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Wallet, 
  Download, 
  ArrowLeft,
  Users,
  MessageSquare,
  Gift,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

// Mock campaign assignment data
const campaignAssignment = {
  campaignName: "Festive Season Rewards",
  campaignId: "CMP-2024-001",
  status: "Active" as "Active" | "Completed" | "Stopped",
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  assignedSegment: "High Value Active",
  segmentSize: 45000,
  campaignObjective: "Activation",
  channelsUsed: ["SMS", "Push", "Email"],
  rewardType: "Cashback",
  rewardAccount: "Main Reward Pool",
  expectedOutcome: "Engagement & Conversion",
};

// Performance KPIs
const performanceKPIs = [
  { label: "Targeted Customers", value: 45000, icon: Users, color: "primary" },
  { label: "Reached Customers", value: 42300, icon: MessageSquare, color: "info" },
  { label: "Engagement Rate", value: "68.5%", icon: Target, color: "warning" },
  { label: "Conversion Rate", value: "12.4%", icon: TrendingUp, color: "success" },
  { label: "Drop-off Rate", value: "31.5%", icon: XCircle, color: "destructive" },
  { label: "Avg TXN Increase", value: "+24%", icon: BarChart3, color: "info" },
  { label: "Campaign ROI", value: "2.4x", icon: Wallet, color: "success" },
];

// Channel performance data
const channelPerformanceData = [
  { 
    channel: "SMS", 
    targeted: 45000, 
    sent: 44200, 
    delivered: 42300, 
    engaged: 28900, 
    converted: 5580, 
    successRate: 94.1 
  },
  { 
    channel: "Push", 
    targeted: 38500, 
    sent: 37200, 
    delivered: 35200, 
    engaged: 22100, 
    converted: 4250, 
    successRate: 91.4 
  },
  { 
    channel: "Email", 
    targeted: 42000, 
    sent: 41500, 
    delivered: 39800, 
    engaged: 18200, 
    converted: 3150, 
    successRate: 94.8 
  },
];

// Customer-level results
const customerResults = [
  { msisdn: "2519****1234", segment: "High Value", channel: "SMS", status: "Converted", engaged: true, converted: true, rewardIssued: true },
  { msisdn: "2519****5678", segment: "High Value", channel: "Push", status: "Engaged", engaged: true, converted: false, rewardIssued: false },
  { msisdn: "2519****9012", segment: "High Value", channel: "SMS", status: "Delivered", engaged: false, converted: false, rewardIssued: false },
  { msisdn: "2519****3456", segment: "High Value", channel: "Email", status: "Converted", engaged: true, converted: true, rewardIssued: true },
  { msisdn: "2519****7890", segment: "High Value", channel: "SMS", status: "Failed", engaged: false, converted: false, rewardIssued: false },
  { msisdn: "2519****2345", segment: "High Value", channel: "Push", status: "Converted", engaged: true, converted: true, rewardIssued: true },
  { msisdn: "2519****6789", segment: "High Value", channel: "SMS", status: "Engaged", engaged: true, converted: false, rewardIssued: false },
  { msisdn: "2519****0123", segment: "High Value", channel: "Email", status: "Delivered", engaged: false, converted: false, rewardIssued: false },
];

// Reward utilization data
const rewardUtilization = {
  rewardAccount: "Main Reward Pool",
  openingBalance: 1500000,
  totalIssued: 385000,
  failedRewards: 12500,
  remainingBalance: 1102500,
};

const rewardDistribution = [
  { type: "Cashback", count: 28900, amount: 289000 },
  { type: "Bonus Credit", count: 8500, amount: 85000 },
  { type: "Data Bundle", count: 1100, amount: 11000 },
];

// Goal achievement data
const goalAchievement = [
  { goal: "Engagement", target: "30%", achieved: "27%", targetValue: 30, achievedValue: 27, status: "missed" },
  { goal: "Conversion", target: "10%", achieved: "12.4%", targetValue: 10, achievedValue: 12.4, status: "achieved" },
  { goal: "Activation", target: "25%", achieved: "28.9%", targetValue: 25, achievedValue: 28.9, status: "achieved" },
  { goal: "ROI", target: "2.0x", achieved: "2.4x", targetValue: 2.0, achievedValue: 2.4, status: "achieved" },
];

// Audit metadata
const auditMetadata = {
  createdBy: "Sarah M.",
  approvedBy: "John D.",
  lastUpdated: "2024-01-15 14:32:00",
  reportGeneratedDate: "2024-01-16 09:15:00",
};

// Daily trend data
const dailyTrendData = [
  { date: "Jan 1", targeted: 5000, delivered: 4800, activated: 2900 },
  { date: "Jan 2", targeted: 4500, delivered: 4300, activated: 2700 },
  { date: "Jan 3", targeted: 5200, delivered: 4900, activated: 3100 },
  { date: "Jan 4", targeted: 4800, delivered: 4500, activated: 2800 },
  { date: "Jan 5", targeted: 5500, delivered: 5200, activated: 3400 },
  { date: "Jan 6", targeted: 6000, delivered: 5700, activated: 3800 },
  { date: "Jan 7", targeted: 5800, delivered: 5500, activated: 3600 },
];

export function PerformanceTab() {
  const [searchMsisdn, setSearchMsisdn] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredCustomers = customerResults.filter(c => 
    c.msisdn.includes(searchMsisdn)
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Converted":
        return <Badge className="bg-success/10 text-success border-success/20">Converted</Badge>;
      case "Engaged":
        return <Badge className="bg-info/10 text-info border-info/20">Engaged</Badge>;
      case "Delivered":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Delivered</Badge>;
      case "Failed":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isRunning = campaignAssignment.status === "Active";

  return (
    <div className="space-y-6">
      {/* Warning Banner for Running Campaign */}
      {isRunning && (
        <div className="bg-warning/10 border border-warning/20 p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <span className="text-warning font-medium">
            Campaign is still running. Data shown is real-time and may change.
          </span>
        </div>
      )}

      {/* Header Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">{campaignAssignment.campaignName}</h2>
                <Badge 
                  className={cn(
                    campaignAssignment.status === "Active" && "bg-success/10 text-success border-success/20",
                    campaignAssignment.status === "Completed" && "bg-info/10 text-info border-info/20",
                    campaignAssignment.status === "Stopped" && "bg-destructive/10 text-destructive border-destructive/20"
                  )}
                >
                  {campaignAssignment.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Campaign ID</span>
                  <p className="font-medium">{campaignAssignment.campaignId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Campaign Period</span>
                  <p className="font-medium">{campaignAssignment.startDate} – {campaignAssignment.endDate}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Assignment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <span className="text-sm text-muted-foreground">Assigned Segment</span>
              <p className="font-medium">{campaignAssignment.assignedSegment}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Segment Size</span>
              <p className="font-medium">{campaignAssignment.segmentSize.toLocaleString()} customers</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Campaign Objective</span>
              <p className="font-medium">{campaignAssignment.campaignObjective}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Channels Used</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {campaignAssignment.channelsUsed.map(channel => (
                  <Badge key={channel} variant="outline" className="text-xs">{channel}</Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Reward Type</span>
              <p className="font-medium">{campaignAssignment.rewardType}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Reward Account</span>
              <p className="font-medium">{campaignAssignment.rewardAccount}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Expected Outcome</span>
              <p className="font-medium">{campaignAssignment.expectedOutcome}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance KPIs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Performance KPIs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {performanceKPIs.map((kpi) => (
              <div key={kpi.label} className="bg-muted/30 border p-4 text-center">
                <div className={cn(
                  "mx-auto w-10 h-10 flex items-center justify-center mb-2",
                  kpi.color === "primary" && "bg-primary/10",
                  kpi.color === "info" && "bg-info/10",
                  kpi.color === "warning" && "bg-warning/10",
                  kpi.color === "success" && "bg-success/10",
                  kpi.color === "destructive" && "bg-destructive/10"
                )}>
                  <kpi.icon className={cn(
                    "w-5 h-5",
                    kpi.color === "primary" && "text-primary",
                    kpi.color === "info" && "text-info",
                    kpi.color === "warning" && "text-warning",
                    kpi.color === "success" && "text-success",
                    kpi.color === "destructive" && "text-destructive"
                  )} />
                </div>
                <p className="text-xl font-bold">
                  {typeof kpi.value === "number" ? kpi.value.toLocaleString() : kpi.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Channel Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Channel Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Targeted</TableHead>
                <TableHead className="text-right">Sent</TableHead>
                <TableHead className="text-right">Delivered</TableHead>
                <TableHead className="text-right">Engaged</TableHead>
                <TableHead className="text-right">Converted</TableHead>
                <TableHead className="text-right">Success %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channelPerformanceData.map((row) => (
                <TableRow key={row.channel}>
                  <TableCell className="font-medium">{row.channel}</TableCell>
                  <TableCell className="text-right">{row.targeted.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.sent.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.delivered.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.engaged.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.converted.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Badge className={cn(
                      row.successRate >= 90 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                    )}>
                      {row.successRate}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Daily Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Daily Performance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                <Tooltip 
                  formatter={(value: number) => [value.toLocaleString(), ""]}
                  contentStyle={{ borderRadius: 0 }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="targeted" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Targeted"
                />
                <Line 
                  type="monotone" 
                  dataKey="delivered" 
                  stroke="hsl(var(--info))" 
                  strokeWidth={2}
                  name="Delivered"
                />
                <Line 
                  type="monotone" 
                  dataKey="activated" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  name="Activated"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Customer-Level Results */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Customer-Level Results
            </CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by MSISDN..." 
                value={searchMsisdn}
                onChange={(e) => {
                  setSearchMsisdn(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MSISDN</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Engaged</TableHead>
                <TableHead className="text-center">Converted</TableHead>
                <TableHead className="text-center">Reward Issued</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((customer, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-mono">{customer.msisdn}</TableCell>
                  <TableCell>{customer.segment}</TableCell>
                  <TableCell>{customer.channel}</TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell className="text-center">
                    {customer.engaged ? (
                      <CheckCircle2 className="w-4 h-4 text-success mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-muted-foreground mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.converted ? (
                      <CheckCircle2 className="w-4 h-4 text-success mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-muted-foreground mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.rewardIssued ? (
                      <CheckCircle2 className="w-4 h-4 text-success mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-muted-foreground mx-auto" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {paginatedCustomers.length} of {filteredCustomers.length} results
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">Page {currentPage} of {totalPages || 1}</span>
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reward Utilization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Reward Utilization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-muted/30 border p-4">
              <p className="text-sm text-muted-foreground">Reward Account</p>
              <p className="font-semibold">{rewardUtilization.rewardAccount}</p>
            </div>
            <div className="bg-muted/30 border p-4">
              <p className="text-sm text-muted-foreground">Opening Balance</p>
              <p className="font-semibold">{rewardUtilization.openingBalance.toLocaleString()} ETB</p>
            </div>
            <div className="bg-muted/30 border p-4">
              <p className="text-sm text-muted-foreground">Total Issued</p>
              <p className="font-semibold text-success">{rewardUtilization.totalIssued.toLocaleString()} ETB</p>
            </div>
            <div className="bg-muted/30 border p-4">
              <p className="text-sm text-muted-foreground">Failed Rewards</p>
              <p className="font-semibold text-destructive">{rewardUtilization.failedRewards.toLocaleString()} ETB</p>
            </div>
            <div className="bg-muted/30 border p-4">
              <p className="text-sm text-muted-foreground">Remaining Balance</p>
              <p className="font-semibold">{rewardUtilization.remainingBalance.toLocaleString()} ETB</p>
            </div>
          </div>

          {/* Distribution Table */}
          <div>
            <h4 className="font-medium mb-3">Reward Distribution</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reward Type</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Total Amount (ETB)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewardDistribution.map((row) => (
                  <TableRow key={row.type}>
                    <TableCell className="font-medium">{row.type}</TableCell>
                    <TableCell className="text-right">{row.count.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{row.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Goal Achievement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Goal Achievement Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Goal</TableHead>
                <TableHead className="text-right">Target</TableHead>
                <TableHead className="text-right">Achieved</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {goalAchievement.map((row) => (
                <TableRow key={row.goal}>
                  <TableCell className="font-medium">{row.goal}</TableCell>
                  <TableCell className="text-right">{row.target}</TableCell>
                  <TableCell className="text-right font-semibold">{row.achieved}</TableCell>
                  <TableCell className="text-center">
                    {row.status === "achieved" ? (
                      <CheckCircle2 className="w-5 h-5 text-success mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive mx-auto" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Export Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Summary (PDF)
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Customer Detail (CSV)
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Reward Usage (Excel)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit & Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Audit & Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <span className="text-sm text-muted-foreground">Campaign Created By</span>
              <p className="font-medium">{auditMetadata.createdBy}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Approved By</span>
              <p className="font-medium">{auditMetadata.approvedBy}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <p className="font-medium">{auditMetadata.lastUpdated}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Report Generated Date</span>
              <p className="font-medium">{auditMetadata.reportGeneratedDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
