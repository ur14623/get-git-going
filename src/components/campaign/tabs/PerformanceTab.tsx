import { useState } from "react";
import { BarChart3, TrendingUp, Target, Wallet } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const funnelData = [
  { name: "Targeted", value: 45000, fill: "hsl(var(--primary))" },
  { name: "Delivered", value: 42300, fill: "hsl(var(--info))" },
  { name: "Rewarded", value: 38500, fill: "hsl(var(--warning))" },
  { name: "Activated", value: 28900, fill: "hsl(var(--success))" },
];

const dailyTrendData = [
  { date: "Jan 1", targeted: 5000, delivered: 4800, activated: 2900 },
  { date: "Jan 2", targeted: 4500, delivered: 4300, activated: 2700 },
  { date: "Jan 3", targeted: 5200, delivered: 4900, activated: 3100 },
  { date: "Jan 4", targeted: 4800, delivered: 4500, activated: 2800 },
  { date: "Jan 5", targeted: 5500, delivered: 5200, activated: 3400 },
  { date: "Jan 6", targeted: 6000, delivered: 5700, activated: 3800 },
  { date: "Jan 7", targeted: 5800, delivered: 5500, activated: 3600 },
  { date: "Jan 8", targeted: 4200, delivered: 4000, activated: 2500 },
  { date: "Jan 9", targeted: 4000, delivered: 3800, activated: 2400 },
];

const channelComparisonData = [
  { channel: "SMS", sent: 44200, delivered: 42300, activated: 18500 },
  { channel: "Push", sent: 38500, delivered: 35200, activated: 15200 },
];

const performanceKPIs = [
  {
    label: "Activation Rate",
    value: "64.2%",
    change: "+5.2%",
    positive: true,
    icon: Target,
  },
  {
    label: "Cost per Activation",
    value: "13.32 ETB",
    change: "-2.1%",
    positive: true,
    icon: Wallet,
  },
  {
    label: "Incremental TXN Value",
    value: "1.2M ETB",
    change: "+18%",
    positive: true,
    icon: TrendingUp,
  },
];

export function PerformanceTab() {
  const [dateRange, setDateRange] = useState("7d");
  const [channelFilter, setChannelFilter] = useState("all");

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="14d">Last 14 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="push">Push</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {performanceKPIs.map((kpi) => (
          <div key={kpi.label} className="bg-card border p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-primary/10">
                <kpi.icon className="w-4 h-4 text-primary" />
              </div>
              <span className={`text-sm font-medium ${kpi.positive ? "text-success" : "text-destructive"}`}>
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold">{kpi.value}</p>
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Funnel Chart */}
      <div className="bg-card border p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Conversion Funnel</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="name" width={80} />
              <Tooltip 
                formatter={(value: number) => [value.toLocaleString(), "Customers"]}
                contentStyle={{ borderRadius: 0 }}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Trend */}
      <div className="bg-card border p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Daily Performance Trend</h3>
        </div>
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
      </div>

      {/* Channel Comparison */}
      <div className="bg-card border p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Channel Comparison</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channelComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="channel" />
              <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
              <Tooltip 
                formatter={(value: number) => [value.toLocaleString(), ""]}
                contentStyle={{ borderRadius: 0 }}
              />
              <Legend />
              <Bar dataKey="sent" fill="hsl(var(--primary))" name="Sent" />
              <Bar dataKey="delivered" fill="hsl(var(--info))" name="Delivered" />
              <Bar dataKey="activated" fill="hsl(var(--success))" name="Activated" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
