import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3,
  Clock,
  Zap
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PerformanceStatsProps {
  throughputLastHour: number;
  eventsLastHour: number;
  eventsLast24h: number;
  eventsLast7d: number;
  errorRate: number;
  retryCount: number;
}

const mockTrendData = [
  { time: "00:00", events: 1200 },
  { time: "04:00", events: 800 },
  { time: "08:00", events: 2400 },
  { time: "12:00", events: 3200 },
  { time: "16:00", events: 2800 },
  { time: "20:00", events: 1600 },
  { time: "24:00", events: 1000 }
];

const mockNodePerformance = [
  { name: "SFTP Collector", throughput: 520, errors: 2, status: "running" },
  { name: "ASCII Decoder", throughput: 515, errors: 0, status: "running" },
  { name: "Validation BLN", throughput: 412, errors: 8, status: "partial" },
  { name: "FDC Distributor", throughput: 412, errors: 0, status: "running" }
];

export function PerformanceStats({
  throughputLastHour = 520,
  eventsLastHour = 15420,
  eventsLast24h = 348960,
  eventsLast7d = 2443200,
  errorRate = 0.02,
  retryCount = 15
}: PerformanceStatsProps) {

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              Throughput
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{throughputLastHour}/hr</div>
            <p className="text-xs text-muted-foreground">Events per hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-success" />
              Last Hour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(eventsLastHour)}</div>
            <p className="text-xs text-muted-foreground">Events processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              Last 24h
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(eventsLast24h)}</div>
            <p className="text-xs text-muted-foreground">Events processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              Last 7d
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(eventsLast7d)}</div>
            <p className="text-xs text-muted-foreground">Events processed</p>
          </CardContent>
        </Card>
      </div>

      {/* Error Rate and Retries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Error Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(errorRate * 100).toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Processing errors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              Retry Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{retryCount}</div>
            <p className="text-xs text-muted-foreground">Failed attempts retried</p>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Processing Trend (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="time" 
                  className="text-muted-foreground"
                  fontSize={12}
                />
                <YAxis 
                  className="text-muted-foreground"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="events" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Node Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Node Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockNodePerformance.map((node, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="font-medium">{node.name}</div>
                  <Badge 
                    variant={node.status === "running" ? "default" : "destructive"}
                    className={node.status === "running" ? "bg-success/10 text-success border-success/20" : ""}
                  >
                    {node.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-muted-foreground">
                    Throughput: <span className="font-medium text-foreground">{node.throughput}/hr</span>
                  </div>
                  <div className="text-muted-foreground">
                    Errors: <span className={`font-medium ${node.errors > 0 ? 'text-destructive' : 'text-success'}`}>
                      {node.errors}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}