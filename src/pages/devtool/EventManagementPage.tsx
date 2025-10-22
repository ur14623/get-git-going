import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Search,
  Eye,
  Trash2,
  ExternalLink,
  Activity,
  AlertCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for Kafka Topics
const mockKafkaTopics = [
  {
    id: "topic-001",
    name: "flow-data-stream",
    status: "Created",
    partitions: 3,
    replicationFactor: 2,
    linkedFlowEdge: "Node-A → Node-B",
    flowId: "flow-001",
    lastError: null,
    createdBy: "admin@safaricom.co.ke",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    metrics: {
      totalMessages: 15420,
      consumerGroups: ["group-1", "group-2"],
      groupLags: { "group-1": 5, "group-2": 12 }
    }
  },
  {
    id: "topic-002", 
    name: "error-notifications",
    status: "Failed",
    partitions: 1,
    replicationFactor: 1,
    linkedFlowEdge: null,
    flowId: null,
    lastError: "Failed to create topic: insufficient replicas",
    createdBy: "system@safaricom.co.ke",
    createdAt: "2024-01-14T14:22:00Z",
    updatedAt: "2024-01-14T14:22:00Z",
    metrics: {
      totalMessages: 0,
      consumerGroups: [],
      groupLags: {}
    }
  },
  {
    id: "topic-003",
    name: "billing-events",
    status: "Pending",
    partitions: 5,
    replicationFactor: 3,
    linkedFlowEdge: "Billing-Collector → Processor",
    flowId: "flow-003",
    lastError: null,
    createdBy: "billing@safaricom.co.ke",
    createdAt: "2024-01-16T09:15:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
    metrics: {
      totalMessages: 8932,
      consumerGroups: ["billing-group"],
      groupLags: { "billing-group": 23 }
    }
  }
];

export function EventManagementPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [topics, setTopics] = useState(mockKafkaTopics);
  const [filteredTopics, setFilteredTopics] = useState(mockKafkaTopics);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [flowFilter, setFlowFilter] = useState("all");

  // Filter topics based on search and filters
  useEffect(() => {
    let filtered = topics;

    if (searchTerm) {
      filtered = filtered.filter(topic =>
        topic.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(topic => topic.status.toLowerCase() === statusFilter);
    }

    if (flowFilter !== "all") {
      filtered = filtered.filter(topic => topic.flowId === flowFilter);
    }

    setFilteredTopics(filtered);
  }, [topics, searchTerm, statusFilter, flowFilter]);

  const handleViewDetails = (topicId: string) => {
    navigate(`/devtool/topics/${topicId}`);
  };

  const handleRetryCreate = async (topicId: string) => {
    try {
      // Mock API call
      setTopics(topics.map(topic => 
        topic.id === topicId 
          ? { ...topic, status: "Pending", lastError: null, updatedAt: new Date().toISOString() }
          : topic
      ));
      toast({
        title: "Success",
        description: "Topic creation retry initiated"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to retry topic creation",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    try {
      // Mock API call
      setTopics(topics.filter(topic => topic.id !== topicId));
      toast({
        title: "Success",
        description: "Topic deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to delete topic",
        variant: "destructive"
      });
    }
  };

  const handleSyncWithKafka = async (topicId: string) => {
    try {
      // Mock API call to sync with Kafka
      setTopics(topics.map(topic =>
        topic.id === topicId
          ? { ...topic, status: "Created", updatedAt: new Date().toISOString() }
          : topic
      ));
      toast({
        title: "Success",
        description: "Synced with Kafka cluster successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync with Kafka",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Created: "bg-success text-success-foreground border-success",
      Pending: "bg-secondary text-secondary-foreground border-secondary", 
      Failed: "bg-destructive text-destructive-foreground border-destructive"
    };
    return variants[status as keyof typeof variants] || "bg-secondary text-secondary-foreground border-secondary";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString();
  };

  const truncateError = (error: string | null) => {
    if (!error) return "N/A";
    return error.length > 50 ? error.substring(0, 50) + "..." : error;
  };

  const totalTopics = topics.length;
  const activeTopics = topics.filter(t => t.status === 'Created').length;
  const failedTopics = topics.filter(t => t.status === 'Failed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-semibold text-foreground">Event Management</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
              <span className="font-semibold">Total:</span> {totalTopics}
            </Badge>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 px-3 py-1">
              <span className="font-semibold">Active:</span> {activeTopics}
            </Badge>
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 px-3 py-1">
              <span className="font-semibold">Failed:</span> {failedTopics}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import Topic
          </Button>
          <Button className="bg-success text-success-foreground hover:bg-success/90">
            <Plus className="mr-2 h-4 w-4" />
            Create New Topic
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="professional-card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search topics by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 surface-interactive"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] surface-interactive">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border shadow-lg z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={flowFilter} onValueChange={setFlowFilter}>
              <SelectTrigger className="w-[160px] surface-interactive">
                <SelectValue placeholder="All Flows" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border shadow-lg z-50">
                <SelectItem value="all">All Flows</SelectItem>
                <SelectItem value="flow-001">Flow 001</SelectItem>
                <SelectItem value="flow-003">Flow 003</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Topics Table */}
      <div className="overflow-hidden border border-border rounded-lg bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/30">
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Topic Name
              </TableHead>
              <TableHead className="h-14 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Configuration
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Flow Link
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Error Status
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Owner
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Created
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTopics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm">No topics found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTopics.map((topic) => (
                <TableRow key={topic.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{topic.name}</div>
                      <div className="text-xs text-muted-foreground">ID: {topic.id}</div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge 
                      variant="outline"
                      className={`text-xs font-medium ${getStatusBadge(topic.status)}`}
                    >
                      {topic.status === 'Created' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {topic.status === 'Pending' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {topic.status === 'Failed' && <XCircle className="h-3 w-3 mr-1" />}
                      {topic.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{topic.partitions} partitions</div>
                      <div className="text-xs text-muted-foreground">RF: {topic.replicationFactor}</div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {topic.linkedFlowEdge ? (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto text-primary hover:text-primary/80 font-medium"
                        onClick={() => {/* Navigate to flow detail */}}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {topic.linkedFlowEdge}
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">No flow linked</span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {topic.lastError ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 text-destructive cursor-help">
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-xs font-medium">{truncateError(topic.lastError)}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-card border border-border shadow-lg max-w-sm">
                            <p>{topic.lastError}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <div className="flex items-center gap-1 text-success">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs font-medium">No errors</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{topic.createdBy.split('@')[0]}</div>
                      <div className="text-xs text-muted-foreground">{topic.createdBy.split('@')[1]}</div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(topic.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleViewDetails(topic.id)}
                              className="hover-scale h-9 w-9"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteTopic(topic.id)}
                              className="hover-scale h-9 w-9 text-destructive border-destructive/30 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Topic</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}