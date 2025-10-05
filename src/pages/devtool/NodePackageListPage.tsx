import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// Mock interface - replace with actual API types
export interface NodePackage {
  id: string;
  node_family_name: string;
  version: string;
  state: "Draft" | "Published" | "Archived";
  uploaded_by: string;
  uploaded_at: string;
  entry_point: string;
}

export function NodePackageListPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [packages, setPackages] = useState<NodePackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<NodePackage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await nodePackageService.getAllPackages();
        const mockData: NodePackage[] = [
          {
            id: "1",
            node_family_name: "Data Processor",
            version: "1.0.0",
            state: "Published",
            uploaded_by: "john.doe@example.com",
            uploaded_at: "2025-01-15T10:30:00Z",
            entry_point: "main.py"
          },
          {
            id: "2",
            node_family_name: "Data Validator",
            version: "2.1.3",
            state: "Draft",
            uploaded_by: "jane.smith@example.com",
            uploaded_at: "2025-01-20T14:20:00Z",
            entry_point: "validator.py"
          },
        ];
        setPackages(mockData);
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
        pkg.node_family_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (stateFilter !== "all") {
      filtered = filtered.filter(pkg => pkg.state.toLowerCase() === stateFilter);
    }

    setFilteredPackages(filtered);
  }, [packages, searchTerm, stateFilter]);

  const handleDelete = async () => {
    if (!packageToDelete) return;

    try {
      // TODO: Replace with actual API call
      // await nodePackageService.deletePackage(packageToDelete);
      setPackages(packages.filter(pkg => pkg.id !== packageToDelete));
      toast({
        title: "Success",
        description: "Node package deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete node package",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setPackageToDelete(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setPackageToDelete(id);
    setDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStateBadgeVariant = (state: string) => {
    switch (state) {
      case "Published":
        return "default";
      case "Draft":
        return "secondary";
      case "Archived":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Node Package Registry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by node family name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Node Family Name</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Uploaded At</TableHead>
                  <TableHead>Entry Point</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredPackages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No node packages found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPackages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.node_family_name}</TableCell>
                      <TableCell>{pkg.version}</TableCell>
                      <TableCell>
                        <Badge variant={getStateBadgeVariant(pkg.state)}>
                          {pkg.state}
                        </Badge>
                      </TableCell>
                      <TableCell>{pkg.uploaded_by}</TableCell>
                      <TableCell>{formatDate(pkg.uploaded_at)}</TableCell>
                      <TableCell className="font-mono text-sm">{pkg.entry_point}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => navigate(`/devtool/node-packages/${pkg.id}`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Details</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteDialog(pkg.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
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
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the node package version.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
