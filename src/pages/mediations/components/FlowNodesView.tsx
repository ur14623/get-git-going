import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Network, 
  List, 
  Play, 
  Square, 
  RotateCcw, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

interface Node {
  id: string;
  name: string;
  type: "collector" | "processor" | "distributor";
  status: "running" | "partial" | "stopped";
  lastRun: string;
  processed: number;
  errors: number;
  warnings: number;
  host: string;
  nextRun?: string;
}

interface FlowNodesViewProps {
  nodes: Node[];
}

const mockNodes: Node[] = [
  {
    id: "1",
    name: "SFTP Collector",
    type: "collector",
    status: "running",
    lastRun: "2024-01-15 14:35:00",
    processed: 15420,
    errors: 2,
    warnings: 5,
    host: "collector-01.domain.com",
    nextRun: "2024-01-15 15:00:00"
  },
  {
    id: "2", 
    name: "ASCII Decoder",
    type: "processor",
    status: "running",
    lastRun: "2024-01-15 14:34:30",
    processed: 15420,
    errors: 0,
    warnings: 1,
    host: "processor-01.domain.com",
    nextRun: "N/A"
  },
  {
    id: "3",
    name: "Validation BLN",
    type: "processor", 
    status: "partial",
    lastRun: "2024-01-15 14:30:00",
    processed: 12340,
    errors: 8,
    warnings: 12,
    host: "processor-02.domain.com",
    nextRun: "Cannot schedule"
  },
  {
    id: "4",
    name: "FDC Distributor",
    type: "distributor",
    status: "running",
    lastRun: "2024-01-15 14:34:45",
    processed: 12340,
    errors: 0,
    warnings: 0,
    host: "distributor-01.domain.com",
    nextRun: "N/A"
  }
];

export function FlowNodesView({ nodes = mockNodes }: FlowNodesViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-success/10 text-success border-success/20";
      case "stopped": return "bg-muted text-muted-foreground border-border";
      case "partial": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <CheckCircle className="h-4 w-4" />;
      case "stopped": return <XCircle className="h-4 w-4" />;
      case "partial": return <AlertTriangle className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "collector": return "bg-blue-50 text-blue-700 border-blue-200";
      case "processor": return "bg-purple-50 text-purple-700 border-purple-200";
      case "distributor": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Flow Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="graph" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="graph" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Graph View
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="graph" className="mt-6">
            {/* Graph View - Visual Pipeline */}
            <div className="flex items-center justify-center min-h-[300px] bg-muted/30 rounded-lg border-2 border-dashed border-border">
              <div className="flex items-center gap-8 p-8">
                {nodes.map((node, index) => (
                  <div key={node.id} className="flex items-center">
                    <div className="relative group">
                      <div className="bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer min-w-[120px]">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getTypeColor(node.type)} variant="outline">
                            {node.type}
                          </Badge>
                          {getStatusIcon(node.status)}
                        </div>
                        <h4 className="font-medium text-sm mb-1">{node.name}</h4>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Processed: {node.processed.toLocaleString()}</div>
                          {node.errors > 0 && (
                            <div className="text-destructive">Errors: {node.errors}</div>
                          )}
                          {node.warnings > 0 && (
                            <div className="text-warning">Warnings: {node.warnings}</div>
                          )}
                        </div>
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        <div className="font-medium">{node.name}</div>
                        <div>Type: {node.type}</div>
                        <div>Last run: {node.lastRun}</div>
                        <div>Host: {node.host}</div>
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    {index < nodes.length - 1 && (
                      <div className="mx-4 text-muted-foreground">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="mt-6">
            {/* List View - Table */}
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Node Name</th>
                      <th className="text-left p-4 font-medium">Type</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Scheduling</th>
                      <th className="text-left p-4 font-medium">Counters</th>
                      <th className="text-left p-4 font-medium">Host</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map((node) => (
                      <tr key={node.id} className="border-b hover:bg-muted/30">
                        <td className="p-4 font-medium">{node.name}</td>
                        <td className="p-4">
                          <Badge className={getTypeColor(node.type)} variant="outline">
                            {node.type}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(node.status)}>
                            {getStatusIcon(node.status)}
                            <span className="ml-1 capitalize">{node.status}</span>
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            {node.nextRun === "Cannot schedule" ? (
                              <span className="text-destructive">{node.nextRun}</span>
                            ) : node.nextRun === "N/A" ? (
                              <span className="text-muted-foreground">{node.nextRun}</span>
                            ) : (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {node.nextRun}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm space-y-1">
                            <div>Processed: {node.processed.toLocaleString()}</div>
                            {node.errors > 0 && (
                              <div className="text-destructive">Errors: {node.errors}</div>
                            )}
                            {node.warnings > 0 && (
                              <div className="text-warning">Warnings: {node.warnings}</div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {node.host}
                          </code>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            {node.status === "stopped" && (
                              <Button size="sm" variant="outline">
                                <Play className="h-3 w-3" />
                              </Button>
                            )}
                            {(node.status === "running" || node.status === "partial") && (
                              <Button size="sm" variant="outline">
                                <Square className="h-3 w-3" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <RotateCcw className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}