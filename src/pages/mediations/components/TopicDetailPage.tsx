import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trash2, ArrowUpDown } from "lucide-react";

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
  fromNode?: string;
  toNode?: string;
  totalMessages?: number;
  consumerGroups?: Array<{
    name: string;
    lag: number;
  }>;
}

const mockTopicDetail: KafkaTopic = {
  id: "topic-001",
  name: "billing.events.charging",
  status: "Created",
  partitions: 12,
  replicationFactor: 3,
  linkedFlowEdge: "ChargingGateway → BillingProcessor",
  createdBy: "admin@company.com",
  createdAt: new Date("2024-01-15T10:30:00Z"),
  fromNode: "ChargingGateway",
  toNode: "BillingProcessor",
  totalMessages: 2847392,
  consumerGroups: [
    { name: "billing-service-group", lag: 245 },
    { name: "audit-service-group", lag: 12 },
    { name: "analytics-group", lag: 0 }
  ]
};

export function TopicDetailPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  
  // In real app, fetch topic by ID
  const topic = mockTopicDetail;

  if (!topic) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border border-border bg-card">
            <CardContent className="p-6 text-center">
              <h1 className="text-xl font-semibold text-foreground mb-2">Topic Not Found</h1>
              <p className="text-muted-foreground mb-4">The requested topic could not be found.</p>
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: KafkaTopic["status"]) => {
    const variants = {
      "Pending": "secondary",
      "Created": "default", 
      "Failed": "destructive"
    } as const;
    
    return (
      <Badge variant={variants[status]} className="text-sm">
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border border-border bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{topic.name}</h1>
                  <p className="text-sm text-muted-foreground mt-1">Kafka Topic Details</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {topic.status === "Failed" && (
                  <Button variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retry Create
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sync
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Topic Info */}
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle>Topic Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-foreground font-medium">{topic.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">{getStatusBadge(topic.status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Partitions</label>
                <p className="text-foreground font-medium">{topic.partitions}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Replication Factor</label>
                <p className="text-foreground font-medium">{topic.replicationFactor}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created By</label>
                <p className="text-foreground">{topic.createdBy}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created At</label>
                <p className="text-foreground">{topic.createdAt.toLocaleString()}</p>
              </div>
            </div>
            
            {topic.lastError && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <label className="text-sm font-medium text-destructive">Error Message</label>
                <p className="text-destructive text-sm mt-1">{topic.lastError}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Flow Link */}
        {topic.linkedFlowEdge && (
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle>Flow Connection</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="w-24 h-12 bg-primary/10 border border-primary/20 rounded flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">{topic.fromNode}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">From Node</p>
                </div>
                
                <div className="flex-1 h-px bg-border relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-background px-2">
                      <span className="text-xs text-muted-foreground">flows through</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-24 h-12 bg-success/10 border border-success/20 rounded flex items-center justify-center">
                    <span className="text-xs font-medium text-success">{topic.toNode}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">To Node</p>
                </div>
              </div>
              
              <div className="mt-4">
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto"
                  onClick={() => navigate('/flows')}
                >
                  View Flow Details →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Kafka Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Message Stats */}
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle>Message Statistics</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Messages</label>
                  <p className="text-2xl font-bold text-foreground">{topic.totalMessages?.toLocaleString() || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Messages per Partition (avg)</label>
                  <p className="text-lg font-semibold text-foreground">
                    {topic.totalMessages ? Math.round(topic.totalMessages / topic.partitions).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consumer Groups */}
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle>Consumer Groups</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {topic.consumerGroups?.map((group, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                    <div>
                      <p className="font-medium text-foreground">{group.name}</p>
                      <p className="text-xs text-muted-foreground">Consumer Group</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${group.lag === 0 ? 'text-success' : group.lag < 100 ? 'text-warning' : 'text-destructive'}`}>
                        {group.lag}
                      </p>
                      <p className="text-xs text-muted-foreground">Lag</p>
                    </div>
                  </div>
                )) || (
                  <p className="text-muted-foreground text-center py-4">No consumer groups found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}