import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Upload, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export interface NodePackage {
  id: string;
  name: string;
  description: string;
  node_family: string;
  node_family_name: string;
  is_deployed: boolean;
  active_package_version: number | null;
  latest_version: number;
  total_versions: number;
  created_by: string;
  created_at: string;
  last_updated_by: string;
  last_updated_at: string;
}

interface NodePackageResponse {
  total_packages: number;
  total_active: number;
  total_draft: number;
  packages: NodePackage[];
}

export function NodePackageListPage() {
  const { toast } = useToast();
  
  const [packages, setPackages] = useState<NodePackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<NodePackage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [counters, setCounters] = useState({ total: 0, active: 0, draft: 0 });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get<NodePackageResponse>(`${API_BASE_URL}/node_package/`);
        setPackages(response.data.packages);
        setCounters({
          total: response.data.total_packages,
          active: response.data.total_active,
          draft: response.data.total_draft
        });
      } catch (error) {
        console.error("Failed to fetch node packages:", error);
        toast({
          title: "Error",
          description: "Failed to load node packages",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [toast]);

  // Filter logic
  useEffect(() => {
    let filtered = packages;

    if (searchTerm) {
      filtered = filtered.filter(pkg =>
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.node_family_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      if (statusFilter === "deployed") {
        filtered = filtered.filter(pkg => pkg.is_deployed === true);
      } else if (statusFilter === "draft") {
        filtered = filtered.filter(pkg => pkg.is_deployed === false);
      }
    }

    setFilteredPackages(filtered);
  }, [packages, searchTerm, statusFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-semibold text-foreground">Node Package Registry</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
              <span className="font-semibold">Total:</span> {counters.total}
            </Badge>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 px-3 py-1">
              <span className="font-semibold">Active:</span> {counters.active}
            </Badge>
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 px-3 py-1">
              <span className="font-semibold">Draft:</span> {counters.draft}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import Package
          </Button>
          <Button className="bg-success text-success-foreground hover:bg-success/90">
            <Plus className="mr-2 h-4 w-4" />
            Create New Package
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
                placeholder="Search by package name or node family..."
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
                <SelectItem value="deployed">Deployed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading packages...</p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden border border-border rounded-lg bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/30">
                <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Package Name
                </TableHead>
                <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Node Family Name
                </TableHead>
                <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Active Version
                </TableHead>
                <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Last Updated By
                </TableHead>
                <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Last Updated At
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-sm">No packages found</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPackages.map((pkg) => (
                  <TableRow 
                    key={pkg.id} 
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <div>
                        <div className="font-medium text-foreground">{pkg.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {pkg.node_family_name}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge 
                        variant="outline"
                        className={`text-xs font-medium ${
                          pkg.is_deployed ? 'bg-success text-success-foreground border-success' : 'bg-warning text-warning-foreground border-warning'
                        }`}
                      >
                        {pkg.is_deployed ? "Deployed" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {pkg.active_package_version || "N/A"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {pkg.last_updated_by || "System"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(pkg.last_updated_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
