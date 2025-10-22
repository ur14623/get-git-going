import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle>Node Package Registry</CardTitle>
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by package name or node family..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="deployed">Deployed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package Name</TableHead>
                  <TableHead>Node Family Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active Version</TableHead>
                  <TableHead>Last Updated By</TableHead>
                  <TableHead>Last Updated At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredPackages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No node packages found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPackages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.name}</TableCell>
                      <TableCell>{pkg.node_family_name}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={pkg.is_deployed ? "default" : "secondary"}
                          className={pkg.is_deployed ? "bg-success" : ""}
                        >
                          {pkg.is_deployed ? "Deployed" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>{pkg.active_package_version || "—"}</TableCell>
                      <TableCell>{pkg.last_updated_by || "—"}</TableCell>
                      <TableCell>{formatDate(pkg.last_updated_at)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
