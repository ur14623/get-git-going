import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, Power, Copy, Plus } from "lucide-react";

interface KafkaConfig {
  id: string;
  name: string;
  version: string;
  active: boolean;
  bootstrapServers: string[];
  securityProtocol: "PLAINTEXT" | "SSL" | "SASL_PLAINTEXT" | "SASL_SSL";
  clientId: string;
  retries: number;
  versionComment?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  saslMechanism?: string;
  sslTruststore?: string;
}

const mockConfigDetail: KafkaConfig = {
  id: "config-001",
  name: "production-kafka-cluster",
  version: "1.4",
  active: true,
  bootstrapServers: ["kafka-prod-01:9092", "kafka-prod-02:9092", "kafka-prod-03:9092"],
  securityProtocol: "SASL_SSL",
  clientId: "mediation-service-prod",
  retries: 3,
  versionComment: "Updated SSL configuration and increased retry count for better reliability",
  createdAt: new Date("2024-01-10T08:30:00Z"),
  updatedAt: new Date("2024-01-18T14:22:00Z"),
  createdBy: "admin@company.com",
  saslMechanism: "SCRAM-SHA-256",
  sslTruststore: "/opt/kafka/ssl/kafka.client.truststore.jks"
};

const mockVersionHistory: KafkaConfig[] = [
  {
    id: "config-001",
    name: "production-kafka-cluster", 
    version: "1.4",
    active: true,
    bootstrapServers: ["kafka-prod-01:9092", "kafka-prod-02:9092", "kafka-prod-03:9092"],
    securityProtocol: "SASL_SSL",
    clientId: "mediation-service-prod",
    retries: 3,
    versionComment: "Updated SSL configuration and increased retry count",
    createdAt: new Date("2024-01-18T14:22:00Z"),
    updatedAt: new Date("2024-01-18T14:22:00Z"),
    createdBy: "admin@company.com"
  },
  {
    id: "config-002",
    name: "production-kafka-cluster",
    version: "1.3", 
    active: false,
    bootstrapServers: ["kafka-prod-01:9092", "kafka-prod-02:9092", "kafka-prod-03:9092"],
    securityProtocol: "SASL_SSL",
    clientId: "mediation-service-prod",
    retries: 2,
    versionComment: "Added third broker for high availability",
    createdAt: new Date("2024-01-12T10:20:00Z"),
    updatedAt: new Date("2024-01-12T10:20:00Z"),
    createdBy: "devops@company.com"
  },
  {
    id: "config-003",
    name: "production-kafka-cluster",
    version: "1.2",
    active: false,
    bootstrapServers: ["kafka-prod-01:9092", "kafka-prod-02:9092"],
    securityProtocol: "SSL",
    clientId: "mediation-service-prod", 
    retries: 1,
    versionComment: "Initial production configuration",
    createdAt: new Date("2024-01-10T08:30:00Z"),
    updatedAt: new Date("2024-01-10T08:30:00Z"),
    createdBy: "admin@company.com"
  }
];

export function ConfigDetailPage() {
  const { configId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  
  // In real app, fetch config by ID
  const config = mockConfigDetail;

  if (!config) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border border-border bg-card">
            <CardContent className="p-6 text-center">
              <h1 className="text-xl font-semibold text-foreground mb-2">Configuration Not Found</h1>
              <p className="text-muted-foreground mb-4">The requested configuration could not be found.</p>
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

  const getSecurityBadge = (protocol: KafkaConfig["securityProtocol"]) => {
    const variants = {
      "PLAINTEXT": "secondary",
      "SSL": "default",
      "SASL_PLAINTEXT": "secondary", 
      "SASL_SSL": "default"
    } as const;
    
    return (
      <Badge variant={variants[protocol]} className="text-sm">
        {protocol}
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
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-foreground">{config.name}</h1>
                    <Badge variant="outline">v{config.version}</Badge>
                    {config.active && (
                      <Badge variant="default">Active</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Kafka Configuration Details</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Power className="h-4 w-4 mr-2" />
                  {config.active ? "Deactivate" : "Activate"}
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Clone
                </Button>
                <Button size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Configuration Details</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="history">Version History</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Info */}
              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-foreground font-medium">{config.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Version</label>
                    <p className="text-foreground font-medium">v{config.version}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">
                      {config.active ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Client ID</label>
                    <p className="text-foreground font-mono text-sm">{config.clientId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Security Protocol</label>
                    <div className="mt-1">{getSecurityBadge(config.securityProtocol)}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Settings */}
              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Retries</label>
                    <p className="text-foreground font-medium">{config.retries}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created By</label>
                    <p className="text-foreground">{config.createdBy}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created At</label>
                    <p className="text-foreground">{config.createdAt.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Updated At</label>
                    <p className="text-foreground">{config.updatedAt.toLocaleString()}</p>
                  </div>
                  {config.versionComment && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Version Comment</label>
                      <p className="text-foreground text-sm">{config.versionComment}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Bootstrap Servers */}
            <Card className="border border-border bg-card">
              <CardHeader>
                <CardTitle>Bootstrap Servers</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  {config.bootstrapServers.map((server, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                      <span className="font-mono text-sm">{server}</span>
                      <Badge variant="outline" className="text-xs">
                        Server {index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auth">
            <Card className="border border-border bg-card">
              <CardHeader>
                <CardTitle>Authentication Configuration</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Security Protocol</label>
                    <div className="mt-1">{getSecurityBadge(config.securityProtocol)}</div>
                  </div>
                  
                  {config.saslMechanism && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">SASL Mechanism</label>
                      <p className="text-foreground font-medium">{config.saslMechanism}</p>
                    </div>
                  )}
                  
                  {config.sslTruststore && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">SSL Truststore Path</label>
                      <p className="text-foreground font-mono text-sm">{config.sslTruststore}</p>
                    </div>
                  )}
                  
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Username</label>
                    <p className="text-foreground">***********</p>
                    <p className="text-xs text-muted-foreground mt-1">Masked for security</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Password</label>
                    <p className="text-foreground">***********</p>
                    <p className="text-xs text-muted-foreground mt-1">Masked for security</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Update Credentials
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="border border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Version History</CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Version
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Version</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockVersionHistory.map((version) => (
                      <TableRow key={version.id}>
                        <TableCell>
                          <Badge variant="outline">v{version.version}</Badge>
                        </TableCell>
                        <TableCell>
                          {version.active ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{version.versionComment || '-'}</p>
                        </TableCell>
                        <TableCell className="text-sm">{version.createdBy}</TableCell>
                        <TableCell className="text-sm">{version.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Power className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}