import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  RefreshCcw,
  Trash2,
  RotateCcw,
  ExternalLink,
  BarChart3,
  Users,
  Network,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for Kafka Topics (same as EventManagementPage)
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

export function TopicDetailPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Find the topic by ID
  const topic = mockKafkaTopics.find(t => t.id === topicId);

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="p-8">
          <div className="professional-card p-6 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Topic Not Found</h1>
            <p className="text-muted-foreground mb-6">The requested topic could not be found.</p>
            <Button onClick={() => navigate("/devtool")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dev Tool
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleRetryCreate = async () => {
    toast({
      title: "Success",
      description: "Topic creation retry initiated"
    });
  };

  const handleDeleteTopic = async () => {
    toast({
      title: "Success",
      description: "Topic deleted successfully"
    });
    navigate("/devtool");
  };

  const handleSyncWithKafka = async () => {
    toast({
      title: "Success",
      description: "Synced with Kafka cluster successfully"
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="professional-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate("/devtool")}
                className="hover-scale"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Topic Details</h1>
                <p className="text-muted-foreground mt-1">{topic.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {topic.status === "Failed" && (
                <Button
                  variant="outline"
                  onClick={handleRetryCreate}
                  className="hover-scale text-warning border-warning/30 hover:bg-warning/10"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleSyncWithKafka}
                className="hover-scale"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Sync
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteTopic}
                className="hover-scale text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="info">Topic Info</TabsTrigger>
            <TabsTrigger value="metrics">Kafka Metrics</TabsTrigger>
            <TabsTrigger value="flow">Flow Link</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-6">
            <div className="professional-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Basic Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Topic Name</Label>
                  <p className="text-base font-semibold text-foreground">{topic.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Status</Label>
                  <div>
                    <Badge variant="outline" className={`text-sm font-medium ${getStatusBadge(topic.status)}`}>
                      {topic.status === 'Created' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {topic.status === 'Pending' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {topic.status === 'Failed' && <XCircle className="h-3 w-3 mr-1" />}
                      {topic.status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Topic ID</Label>
                  <p className="text-base font-mono text-foreground">{topic.id}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Partitions</Label>
                  <p className="text-base font-semibold text-foreground">{topic.partitions}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Replication Factor</Label>
                  <p className="text-base font-semibold text-foreground">{topic.replicationFactor}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Created By</Label>
                  <p className="text-base text-foreground">{topic.createdBy}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Created At</Label>
                  <p className="text-sm text-muted-foreground">{formatDate(topic.createdAt)}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Updated At</Label>
                  <p className="text-sm text-muted-foreground">{formatDate(topic.updatedAt)}</p>
                </div>
              </div>
              {topic.lastError && (
                <div className="mt-6 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <Label className="text-sm font-medium text-destructive uppercase tracking-wider">Error Message</Label>
                  <p className="text-sm text-destructive mt-2">
                    {topic.lastError}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="professional-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Messages</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">{topic.metrics.totalMessages.toLocaleString()}</p>
              </div>
              <div className="professional-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-info/10 rounded-lg">
                    <Users className="h-5 w-5 text-info" />
                  </div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Consumer Groups</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">{topic.metrics.consumerGroups.length}</p>
              </div>
              <div className="professional-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Network className="h-5 w-5 text-warning" />
                  </div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Partitions</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">{topic.partitions}</p>
              </div>
            </div>
            
            {topic.metrics.consumerGroups.length > 0 && (
              <div className="professional-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Consumer Group Lag</h3>
                <div className="space-y-3">
                  {topic.metrics.consumerGroups.map((group: string) => (
                    <div key={group} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border">
                      <span className="font-medium text-foreground">{group}</span>
                      <Badge variant="outline" className="bg-warning text-warning-foreground border-warning">
                        Lag: {topic.metrics.groupLags[group] || 0}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="flow" className="space-y-6">
            <div className="professional-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Flow Connection</h3>
              {topic.linkedFlowEdge ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Connected Flow Edge</Label>
                    <p className="text-base font-semibold text-foreground">{topic.linkedFlowEdge}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Flow ID</Label>
                    <p className="text-base font-semibold text-foreground">{topic.flowId}</p>
                  </div>
                  <Button variant="outline" className="w-fit hover-scale mt-4">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Flow Details
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="p-4 bg-muted/30 rounded-full w-fit mx-auto mb-4">
                    <Network className="h-12 w-12 opacity-50" />
                  </div>
                  <p className="text-lg">No Flow Connection</p>
                  <p className="text-sm mt-1">This topic is not linked to any flow edge</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
