import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Edit, Trash2, Power, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for Kafka configs
const mockKafkaConfigs = [
  {
    id: "config-001",
    name: "production-kafka",
    version: "v1.2.0",
    active: true,
    bootstrapServers: "kafka1.safaricom.co.ke:9092,kafka2.safaricom.co.ke:9092,kafka3.safaricom.co.ke:9092",
    securityProtocol: "SASL_SSL",
    clientId: "mediation-producer-001",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
    createdBy: "admin@safaricom.co.ke",
    updatedBy: "devops@safaricom.co.ke"
  },
  {
    id: "config-002",
    name: "staging-kafka",
    version: "v2.0.0",
    active: false,
    bootstrapServers: "kafka-staging1.safaricom.co.ke:9092,kafka-staging2.safaricom.co.ke:9092",
    securityProtocol: "PLAINTEXT",
    clientId: "mediation-staging-001",
    createdAt: "2024-01-12T09:30:00Z",
    updatedAt: "2024-01-16T11:45:00Z",
    createdBy: "dev@safaricom.co.ke",
    updatedBy: "dev@safaricom.co.ke"
  },
  {
    id: "config-003",
    name: "development-kafka",
    version: "v1.0.0",
    active: false,
    bootstrapServers: "localhost:9092",
    securityProtocol: "PLAINTEXT",
    clientId: "mediation-dev-001",
    createdAt: "2024-01-08T16:20:00Z",
    updatedAt: "2024-01-08T16:20:00Z",
    createdBy: "developer@safaricom.co.ke",
    updatedBy: "developer@safaricom.co.ke"
  }
];

export function ConfigDetailPage() {
  const { configType } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [configs, setConfigs] = useState(mockKafkaConfigs);

  const getConfigTitle = () => {
    switch(configType) {
      case "kafka": return "Kafka Configuration";
      case "database": return "Database Configuration";
      case "api": return "API Configuration";
      case "security": return "Security Configuration";
      default: return "Configuration";
    }
  };

  const handleActivateConfig = (configId: string) => {
    setConfigs(prev => prev.map(config => ({
      ...config,
      active: config.id === configId ? !config.active : config.active && config.id !== configId
    })));
    
    toast({
      title: "Success",
      description: "Configuration status updated"
    });
  };

  const handleDeleteConfig = (configId: string) => {
    setConfigs(prev => prev.filter(config => config.id !== configId));
    toast({
      title: "Success",
      description: "Configuration deleted successfully"
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/devtool")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to DevTool
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{getConfigTitle()}</h1>
              <p className="text-muted-foreground mt-2">
                Manage {configType} configurations and settings
              </p>
            </div>
            
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Create Configuration
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Configurations</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <Card className="border border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Configurations ({configs.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border bg-muted/30">
                      <TableHead className="h-12 px-6">Name</TableHead>
                      <TableHead className="h-12 px-6">Version</TableHead>
                      <TableHead className="h-12 px-6">Active</TableHead>
                      <TableHead className="h-12 px-6">Bootstrap Servers</TableHead>
                      <TableHead className="h-12 px-6">Security Protocol</TableHead>
                      <TableHead className="h-12 px-6">Updated At</TableHead>
                      <TableHead className="h-12 px-6 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {configs.map((config) => (
                      <TableRow key={config.id} className="hover:bg-muted/20">
                        <TableCell className="px-6 py-4 font-medium">{config.name}</TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge variant="outline" className="text-xs">
                            {config.version}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={config.active}
                              onCheckedChange={() => handleActivateConfig(config.id)}
                            />
                            {config.active && (
                              <Badge variant="default" className="text-xs bg-success text-success-foreground border-success">
                                Active
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="text-xs" title={config.bootstrapServers}>
                            {config.bootstrapServers.length > 40 
                              ? config.bootstrapServers.substring(0, 40) + "..."
                              : config.bootstrapServers}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              config.securityProtocol === "SASL_SSL" 
                                ? "bg-success text-success-foreground border-success" 
                                : "bg-warning text-warning-foreground border-warning"
                            }`}
                          >
                            {config.securityProtocol}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                          {formatDate(config.updatedAt)}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-primary hover:text-primary"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-success hover:text-success"
                              onClick={() => handleActivateConfig(config.id)}
                              title={config.active ? "Deactivate" : "Activate"}
                            >
                              <Power className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteConfig(config.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {configs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No configurations found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <Card className="border border-border bg-card">
              <CardContent className="p-8 text-center text-muted-foreground">
                Active configurations view
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inactive" className="space-y-6">
            <Card className="border border-border bg-card">
              <CardContent className="p-8 text-center text-muted-foreground">
                Inactive configurations view
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
