import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database, Settings, ChevronRight, Search } from "lucide-react";
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="professional-card p-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuration Management</h1>
          <p className="text-muted-foreground mt-1">Manage system configurations and integrations</p>
        </div>
      </div>

      {/* Filters & Search */}
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
              <SelectContent className="bg-card border border-border shadow-lg">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Not Configured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Configs Table */}
      <div className="professional-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/50">
              <TableHead className="h-14 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Configuration Type
              </TableHead>
              <TableHead className="h-14 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Description
              </TableHead>
              <TableHead className="h-14 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Configurations
              </TableHead>
              <TableHead className="h-14 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="h-14 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConfigs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-muted/30 rounded-full">
                      <Settings className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <div>
                      <p className="font-medium">No configurations found</p>
                      <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
                    </div>
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
                  className="hover:bg-muted/30 transition-colors cursor-pointer border-b border-border/50"
                >
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-semibold text-foreground">{config.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <span className="text-sm text-muted-foreground">{config.description}</span>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <Badge variant="outline" className="text-xs font-medium">
                      {config.count} {config.count === 1 ? 'Config' : 'Configs'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <Badge 
                      variant="outline"
                      className={`text-xs font-medium ${
                        config.status === "active" 
                          ? "bg-success text-success-foreground border-success" 
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {config.status === "active" ? "Active" : "Not Configured"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-right">
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
