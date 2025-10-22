import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database, Settings, ChevronRight, Search, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Configuration types data
const configTypes = [
  {
    id: "kafka",
    name: "Kafka Configuration",
    description: "Manage Kafka cluster connections and settings",
    icon: Database,
    count: 3,
    status: "active"
  },
  {
    id: "database",
    name: "Database Configuration",
    description: "Manage database connections and settings",
    icon: Database,
    count: 0,
    status: "inactive"
  },
  {
    id: "api",
    name: "API Configuration",
    description: "Manage external API integrations",
    icon: Settings,
    count: 0,
    status: "inactive"
  },
  {
    id: "security",
    name: "Security Configuration",
    description: "Manage security and authentication settings",
    icon: Settings,
    count: 0,
    status: "inactive"
  }
];

export function ConfigManagementPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredConfigs, setFilteredConfigs] = useState(configTypes);

  // Filter configs based on search and filters
  useEffect(() => {
    let filtered = configTypes;

    if (searchTerm) {
      filtered = filtered.filter(config =>
        config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        config.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(config => config.status === statusFilter);
    }

    setFilteredConfigs(filtered);
  }, [searchTerm, statusFilter]);

  const handleConfigClick = (configId: string) => {
    navigate(`/devtool/config/${configId}`);
  };

  const totalConfigs = configTypes.length;
  const activeConfigs = configTypes.filter(c => c.status === 'active').length;
  const inactiveConfigs = configTypes.filter(c => c.status === 'inactive').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-semibold text-foreground">Configuration Management</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
              <span className="font-semibold">Total:</span> {totalConfigs}
            </Badge>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 px-3 py-1">
              <span className="font-semibold">Active:</span> {activeConfigs}
            </Badge>
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 px-3 py-1">
              <span className="font-semibold">Inactive:</span> {inactiveConfigs}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import Config
          </Button>
          <Button className="bg-success text-success-foreground hover:bg-success/90">
            <Plus className="mr-2 h-4 w-4" />
            Create New Config
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
                placeholder="Search configurations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 surface-interactive"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] surface-interactive">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border shadow-lg z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Configs Table */}
      <div className="overflow-hidden border border-border rounded-lg bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/30">
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Configuration Type
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Description
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Configurations
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConfigs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm">No configurations found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredConfigs.map((config) => {
              const Icon = config.icon;
              return (
                <TableRow 
                  key={config.id}
                  onClick={() => handleConfigClick(config.id)}
                  className="hover:bg-muted/20 transition-colors cursor-pointer"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{config.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">{config.description}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline" className="text-xs font-medium">
                      {config.count} {config.count === 1 ? 'Config' : 'Configs'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge 
                      variant="outline"
                      className={`text-xs font-medium ${
                        config.status === "active" 
                          ? "bg-success text-success-foreground border-success" 
                          : "bg-warning text-warning-foreground border-warning"
                      }`}
                    >
                      {config.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <ChevronRight className="h-5 w-5 text-muted-foreground inline-block" />
                  </TableCell>
                </TableRow>
              );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
