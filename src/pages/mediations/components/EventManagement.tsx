import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Eye, RotateCcw, Trash2, ArrowUpDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface KafkaTopic {
  id: string;
  name: string;
  status: "Pending" | "Created" | "Failed";
  partitions: number;
  replicationFactor: number;
  linkedFlowEdge?: string;
  lastError?: string;
  createdBy: string;
  createdAt: Date;
}

const mockTopics: KafkaTopic[] = [
  {
    id: "topic-001",
    name: "billing.events.charging",
    status: "Created",
    partitions: 12,
    replicationFactor: 3,
    linkedFlowEdge: "ChargingGateway → BillingProcessor",
    createdBy: "admin@company.com",
    createdAt: new Date("2024-01-15T10:30:00Z")
  },
  {
    id: "topic-002", 
    name: "rating.events.convergent",
    status: "Failed",
    partitions: 8,
    replicationFactor: 3,
    lastError: "Connection timeout to Kafka cluster. Retrying...",
    linkedFlowEdge: "RatingEngine → ConvergentBilling",
    createdBy: "system@company.com",
    createdAt: new Date("2024-01-16T14:45:00Z")
  },
  {
    id: "topic-003",
    name: "session.control.ncc",
    status: "Pending",
    partitions: 6,
    replicationFactor: 2,
    linkedFlowEdge: "CallControl → SessionManager",
    createdBy: "operator@company.com",
    createdAt: new Date("2024-01-17T09:15:00Z")
  },
  {
    id: "topic-004",
    name: "backup.stream.events",
    status: "Created",
    partitions: 4,
    replicationFactor: 2,
    createdBy: "backup-service@company.com", 
    createdAt: new Date("2024-01-14T16:20:00Z")
  }
];

export function EventManagement() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<KafkaTopic[]>(mockTopics);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [flowFilter, setFlowFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleRetryCreate = (topicId: string) => {
    setTopics(prev => prev.map(topic => 
      topic.id === topicId 
        ? { ...topic, status: "Pending" as const, lastError: undefined }
        : topic
    ));
  };

  const handleDeleteTopic = (topicId: string) => {
    setTopics(prev => prev.filter(topic => topic.id !== topicId));
  };

  const handleSyncWithKafka = async (topicId: string) => {
    // Simulate sync operation
    setTopics(prev => prev.map(topic => 
      topic.id === topicId 
        ? { ...topic, status: "Created" as const, lastError: undefined }
        : topic
    ));
  };

  const getStatusBadge = (status: KafkaTopic["status"]) => {
    const variants = {
      "Pending": "secondary",
      "Created": "default", 
      "Failed": "destructive"
    } as const;
    
    return (
      <Badge variant={variants[status]} className="text-xs font-medium">
        {status}
      </Badge>
    );
  };

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || topic.status === statusFilter;
    const matchesFlow = flowFilter === "all" || 
      (topic.linkedFlowEdge && topic.linkedFlowEdge.toLowerCase().includes(flowFilter.toLowerCase()));
    
    return matchesSearch && matchesStatus && matchesFlow;
  });

  const uniqueFlows = Array.from(new Set(topics.map(t => t.linkedFlowEdge).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <Card className="border border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Kafka Topics</h2>
              <p className="text-sm text-muted-foreground">Manage event streaming topics and their configurations</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Topic
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="border border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by topic name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Created">Created</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={flowFilter} onValueChange={setFlowFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by flow" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Flows</SelectItem>
                {uniqueFlows.map(flow => (
                  <SelectItem key={flow} value={flow!}>{flow}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Topics Table */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Topics ({filteredTopics.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Partitions</TableHead>
                <TableHead>Replication Factor</TableHead>
                <TableHead>Linked Flow Edge</TableHead>
                <TableHead>Last Error</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTopics.map((topic) => (
                <TableRow key={topic.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{topic.name}</TableCell>
                  <TableCell>{getStatusBadge(topic.status)}</TableCell>
                  <TableCell>{topic.partitions}</TableCell>
                  <TableCell>{topic.replicationFactor}</TableCell>
                  <TableCell>
                    {topic.linkedFlowEdge ? (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto text-primary"
                        onClick={() => navigate('/flows')}
                      >
                        {topic.linkedFlowEdge}
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {topic.lastError ? (
                      <span 
                        className="text-destructive text-xs truncate max-w-32 block cursor-help"
                        title={topic.lastError}
                      >
                        {topic.lastError}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{topic.createdBy}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {topic.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => navigate(`/mediations/events/topics/${topic.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {topic.status === "Failed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-warning hover:text-warning"
                          onClick={() => handleRetryCreate(topic.id)}
                          title="Retry Create"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-info hover:text-info"
                        onClick={() => handleSyncWithKafka(topic.id)}
                        title="Sync with Kafka"
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteTopic(topic.id)}
                        title="Delete Topic"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTopics.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No topics found matching the current filters
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}