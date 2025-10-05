import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Eye, Edit, Trash2, Plus, Power } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface KafkaConfig {
  id: string;
  name: string;
  version: string;
  active: boolean;
  bootstrapServers: string[];
  securityProtocol: "PLAINTEXT" | "SSL" | "SASL_PLAINTEXT" | "SASL_SSL";
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
}

const mockConfigs: KafkaConfig[] = [
  {
    id: "config-001",
    name: "production-kafka-cluster",
    version: "1.4",
    active: true,
    bootstrapServers: ["kafka-prod-01:9092", "kafka-prod-02:9092", "kafka-prod-03:9092"],
    securityProtocol: "SASL_SSL",
    clientId: "mediation-service-prod",
    createdAt: new Date("2024-01-10T08:30:00Z"),
    updatedAt: new Date("2024-01-18T14:22:00Z")
  },
  {
    id: "config-002",
    name: "staging-kafka-cluster", 
    version: "1.2",
    active: false,
    bootstrapServers: ["kafka-stage-01:9092", "kafka-stage-02:9092"],
    securityProtocol: "SSL",
    clientId: "mediation-service-stage",
    createdAt: new Date("2024-01-08T12:15:00Z"),
    updatedAt: new Date("2024-01-15T09:45:00Z")
  },
  {
    id: "config-003",
    name: "development-kafka-cluster",
    version: "1.1",
    active: false,
    bootstrapServers: ["localhost:9092"],
    securityProtocol: "PLAINTEXT",
    clientId: "mediation-service-dev",
    createdAt: new Date("2024-01-05T16:00:00Z"),
    updatedAt: new Date("2024-01-12T11:30:00Z")
  },
  {
    id: "config-004",
    name: "production-kafka-cluster",
    version: "1.3", 
    active: false,
    bootstrapServers: ["kafka-prod-01:9092", "kafka-prod-02:9092", "kafka-prod-03:9092"],
    securityProtocol: "SASL_SSL",
    clientId: "mediation-service-prod",
    createdAt: new Date("2024-01-12T10:20:00Z"),
    updatedAt: new Date("2024-01-12T10:20:00Z")
  }
];

export function ConfigManagement() {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState<KafkaConfig[]>(mockConfigs);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleActivateConfig = (configId: string) => {
    setConfigs(prev => prev.map(config => ({
      ...config,
      active: config.id === configId ? !config.active : config.active && config.id !== configId
    })));
  };

  const handleDeleteConfig = (configId: string) => {
    setConfigs(prev => prev.filter(config => config.id !== configId));
  };

  const getSecurityBadge = (protocol: KafkaConfig["securityProtocol"]) => {
    const variants = {
      "PLAINTEXT": "secondary",
      "SSL": "default",
      "SASL_PLAINTEXT": "secondary", 
      "SASL_SSL": "default"
    } as const;
    
    return (
      <Badge variant={variants[protocol]} className="text-xs font-medium">
        {protocol}
      </Badge>
    );
  };

  const truncateServers = (servers: string[]) => {
    const joined = servers.join(", ");
    return joined.length > 40 ? `${joined.substring(0, 40)}...` : joined;
  };

  const filteredConfigs = configs.filter(config => {
    const matchesSearch = config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         config.clientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive = activeFilter === "all" || 
                         (activeFilter === "active" && config.active) ||
                         (activeFilter === "inactive" && !config.active);
    
    return matchesSearch && matchesActive;
  });

  // Group by config name for version history
  const configGroups = filteredConfigs.reduce((acc, config) => {
    if (!acc[config.name]) acc[config.name] = [];
    acc[config.name].push(config);
    return acc;
  }, {} as Record<string, KafkaConfig[]>);

  const displayConfigs = Object.entries(configGroups).flatMap(([name, versions]) => {
    const activeVersion = versions.find(v => v.active);
    const latestVersion = versions.sort((a, b) => parseFloat(b.version) - parseFloat(a.version))[0];
    return activeVersion || latestVersion;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <Card className="border border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Kafka Configurations</h2>
              <p className="text-sm text-muted-foreground">Manage Kafka cluster connections and authentication settings</p>
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
                New Config
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
                placeholder="Search by name or client ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Configs</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Configs Table */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Configurations ({displayConfigs.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Bootstrap Servers</TableHead>
                <TableHead>Security Protocol</TableHead>
                <TableHead>Client ID</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayConfigs.map((config) => (
                <TableRow key={config.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{config.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      v{config.version}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={config.active}
                        onCheckedChange={() => handleActivateConfig(config.id)}
                      />
                      {config.active && (
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span 
                      className="text-xs cursor-help"
                      title={config.bootstrapServers.join(", ")}
                    >
                      {truncateServers(config.bootstrapServers)}
                    </span>
                  </TableCell>
                  <TableCell>{getSecurityBadge(config.securityProtocol)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{config.clientId}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {config.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {config.updatedAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => navigate(`/mediations/config/${config.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-primary hover:text-primary"
                        onClick={() => navigate(`/mediations/config/${config.id}/edit`)}
                        title="Edit / Create New Version"
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
                        title="Delete Config"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {displayConfigs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No configurations found matching the current filters
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}