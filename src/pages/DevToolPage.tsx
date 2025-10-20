import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Plus,
  Upload,
  Download,
  Trash2,
  Copy,
  Settings,
  Workflow,
  Network,
  GitFork,
  Database,
  Grid3X3,
  List,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  ExternalLink,
  GitCommit,
  Activity,
  TrendingUp,
  Users,
  Clock,
  Search,
  Package
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useItems } from '@/pages/apis/ItemService';
import { deleteItem } from '@/pages/apis/ItemService';
import { CreateFlowDialog } from "@/pages/flows/create-flow-dialog";
import { CloneFlowDialog } from "@/pages/flows/clone-flow-dialog";
import { useSubnodes, subnodeService } from "@/services/subnodeService";
import { parameterService } from "@/services/parameterService";
import { LoadingCard } from "@/components/ui/loading";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import axios from "axios";
import { gitService, type GitInfo } from "@/services/gitService";
import { EventManagementPage } from "./devtool/EventManagementPage";
import { ConfigManagementPage } from "./devtool/ConfigManagementPage";
import { NodePackageListPage } from "./devtool/NodePackageListPage";

export function DevToolPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<{[key: string]: number}>({
    flows: 1,
    nodes: 1,
    subnodes: 1,
    parameters: 1
  });
  const [itemsPerPage, setItemsPerPage] = useState<{[key: string]: number}>({
    flows: 10,
    nodes: 10,
    subnodes: 10,
    parameters: 10
  });
  
  // Flows state
  const { data: flowsData, loading: flowsLoading } = useItems();
  const [flows, setFlows] = useState<any[]>([]);
  const [filteredFlows, setFilteredFlows] = useState<any[]>([]);
  const [flowSearchTerm, setFlowSearchTerm] = useState("");
  const [flowStatusFilter, setFlowStatusFilter] = useState("all");
  const [showCreateFlowDialog, setShowCreateFlowDialog] = useState(false);
  const [showCloneFlowDialog, setShowCloneFlowDialog] = useState(false);
  const [flowToClone, setFlowToClone] = useState<any>(null);
  
  // Nodes state
  const [nodes, setNodes] = useState<any[]>([]);
  const [filteredNodes, setFilteredNodes] = useState<any[]>([]);
  const [nodeSearchTerm, setNodeSearchTerm] = useState("");
  const [nodeStatusFilter, setNodeStatusFilter] = useState("all");
  const [nodesLoading, setNodesLoading] = useState(true);
  
  // Subnodes state  
  const { data: subnodesData, loading: subnodesLoading, refetch: refetchSubnodes } = useSubnodes();
  const [filteredSubnodes, setFilteredSubnodes] = useState<any[]>([]);
  const [subnodeSearchTerm, setSubnodeSearchTerm] = useState("");
  const [subnodeStatusFilter, setSubnodeStatusFilter] = useState("all");
  
  // Parameters state
  const [filteredParameters, setFilteredParameters] = useState<any[]>([]);
  const [parameterSearchTerm, setParameterSearchTerm] = useState("");
  const [parameterTypeFilter, setParameterTypeFilter] = useState("all");
  const [parametersData, setParametersData] = useState<{ total: number; published: number; draft_count: number; results: any[] } | null>(null);
  const [parametersLoading, setParametersLoading] = useState(true);

  // Git state
  const [gitInfo, setGitInfo] = useState<GitInfo | null>(null);
  const [gitLoading, setGitLoading] = useState(false);

  // Helper functions
  const getPaginatedItems = (items: any[], category: string) => {
    const start = (currentPage[category] - 1) * itemsPerPage[category];
    const end = start + itemsPerPage[category];
    return items.slice(start, end);
  };

  const getTotalPages = (itemCount: number, category: string) => {
    return Math.ceil(itemCount / itemsPerPage[category]);
  };

  const handlePageChange = (category: string, page: number) => {
    setCurrentPage(prev => ({ ...prev, [category]: page }));
  };

  const handleItemsPerPageChange = (category: string, newItemsPerPage: number) => {
    setItemsPerPage(prev => ({ ...prev, [category]: newItemsPerPage }));
    setCurrentPage(prev => ({ ...prev, [category]: 1 })); // Reset to first page
  };

  // Flow handlers
  const handleDeleteFlow = async (flowId: string) => {
    try {
      await deleteItem(flowId);
      setFlows(flows.filter(flow => flow.id !== flowId));
      toast({
        title: "Success",
        description: "Flow deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete flow",
        variant: "destructive"
      });
    }
  };

  const handleExportFlow = (flow: any) => {
    const dataStr = JSON.stringify(flow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${flow.name || 'flow'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCloneFlow = (flow: any) => {
    setFlowToClone(flow);
    setShowCloneFlowDialog(true);
  };

  // Node handlers
  const handleDeleteNode = async (nodeId: string) => {
    try {
      await deleteItem(nodeId);
      setNodes((nodes || []).filter(node => node.id !== nodeId));
      toast({
        title: "Success",
        description: "Node deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete node",
        variant: "destructive"
      });
    }
  };

  const handleExportNode = (node: any) => {
    const dataStr = JSON.stringify(node, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${node.name || 'node'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Subnode handlers
  const handleDeleteSubnode = async (subnodeId: string) => {
    try {
      await subnodeService.deleteSubnode(subnodeId);
      refetchSubnodes();
      toast({
        title: "Success",
        description: "Subnode deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete subnode",
        variant: "destructive"
      });
    }
  };

  const handleExportSubnode = (subnode: any) => {
    const dataStr = JSON.stringify(subnode, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${subnode.name || 'subnode'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Parameter handlers
  const handleDeleteParameter = async (parameterId: string) => {
    try {
      await parameterService.deleteParameter(parameterId);
      if (parametersData) {
        setParametersData({
          ...parametersData,
          results: parametersData.results.filter(param => param.id !== parameterId)
        });
      }
      toast({
        title: "Success",
        description: "Parameter deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete parameter",
        variant: "destructive"
      });
    }
  };

  const handleExportParameter = (parameter: any) => {
    const dataStr = JSON.stringify(parameter, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${parameter.name || 'parameter'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Git functions
  const fetchGitInfo = async () => {
    setGitLoading(true);
    try {
      const info = await gitService.getLatestCommit();
      setGitInfo(info);
    } catch (error) {
      console.error('Failed to fetch git info:', error);
      toast({
        title: "Error",
        description: "Failed to fetch git information",
        variant: "destructive"
      });
    } finally {
      setGitLoading(false);
    }
  };

  // Filter logic for flows
  useEffect(() => {
    let filtered = flows;

    if (flowSearchTerm) {
      filtered = filtered.filter(flow =>
        flow.name.toLowerCase().includes(flowSearchTerm.toLowerCase())
      );
    }

    if (flowStatusFilter !== "all") {
      if (flowStatusFilter === "deployed") {
        filtered = filtered.filter(flow => flow.is_deployed);
      } else if (flowStatusFilter === "draft") {
        filtered = filtered.filter(flow => !flow.is_deployed);
      }
    }

    setFilteredFlows(filtered);
  }, [flows, flowSearchTerm, flowStatusFilter]);

  // Filter logic for nodes
  useEffect(() => {
    let filtered = nodes;

    if (nodeSearchTerm) {
      filtered = filtered.filter(node =>
        node.name.toLowerCase().includes(nodeSearchTerm.toLowerCase())
      );
    }

    if (nodeStatusFilter !== "all") {
      if (nodeStatusFilter === "deployed") {
        filtered = filtered.filter(node => node.is_deployed);
      } else if (nodeStatusFilter === "draft") {
        filtered = filtered.filter(node => !node.is_deployed);
      }
    }

    setFilteredNodes(filtered);
  }, [nodes, nodeSearchTerm, nodeStatusFilter]);

  // Filter logic for subnodes
  useEffect(() => {
    let filtered = subnodesData?.subnodes || [];

    if (subnodeSearchTerm) {
      filtered = filtered.filter(subnode =>
        subnode.name.toLowerCase().includes(subnodeSearchTerm.toLowerCase())
      );
    }

    if (subnodeStatusFilter !== "all") {
      if (subnodeStatusFilter === "deployed") {
        filtered = filtered.filter(subnode => subnode.status === "Active");
      } else if (subnodeStatusFilter === "draft") {
        filtered = filtered.filter(subnode => subnode.status === "Drafted");
      }
    }

    setFilteredSubnodes(filtered);
  }, [subnodesData, subnodeSearchTerm, subnodeStatusFilter]);

  // Filter logic for parameters
  useEffect(() => {
    let filtered = parametersData?.results || [];

    if (parameterSearchTerm) {
      filtered = filtered.filter(param =>
        param.key.toLowerCase().includes(parameterSearchTerm.toLowerCase())
      );
    }

    if (parameterTypeFilter !== "all") {
      filtered = filtered.filter(param => param.datatype === parameterTypeFilter);
    }

    setFilteredParameters(filtered);
  }, [parametersData, parameterSearchTerm, parameterTypeFilter]);

  // Effects
  useEffect(() => {
    if (flowsData) {
      setFlows(flowsData);
    }
  }, [flowsData]);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/node-families/');
        const nodeData = response.data;
        // Handle the new API response structure
        if (nodeData && nodeData.results && Array.isArray(nodeData.results)) {
          setNodes(nodeData.results);
        } else {
          setNodes([]);
        }
      } catch (error) {
        console.error('Failed to fetch nodes:', error);
        setNodes([]);
      } finally {
        setNodesLoading(false);
      }
    };

    fetchNodes();
  }, []);

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const response = await parameterService.getParametersWithMetadata();
        setParametersData(response);
      } catch (error) {
        console.error('Failed to fetch parameters:', error);
        setParametersData({ total: 0, published: 0, draft_count: 0, results: [] });
      } finally {
        setParametersLoading(false);
      }
    };

    fetchParameters();
  }, []);

  // Render pagination component
  const renderPagination = (category: string, totalItems: number) => {
    const totalPages = getTotalPages(totalItems, category);
    const current = currentPage[category];
    const itemsPerPageValue = itemsPerPage[category];
    
    if (totalItems === 0) return null;

    // Calculate page range to show
    const maxVisiblePages = 5;
    let startPage = Math.max(1, current - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Items per page:</span>
            <Select 
              value={itemsPerPageValue.toString()} 
              onValueChange={(value) => handleItemsPerPageChange(category, parseInt(value))}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {(current - 1) * itemsPerPageValue + 1} to {Math.min(current * itemsPerPageValue, totalItems)} of {totalItems} entries
          </div>
        </div>
        
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => current > 1 && handlePageChange(category, current - 1)}
                  className={current <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {/* First page */}
              {startPage > 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(category, 1)}
                      className="cursor-pointer"
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {startPage > 2 && (
                    <PaginationItem>
                      <span className="px-3 py-2 text-muted-foreground">...</span>
                    </PaginationItem>
                  )}
                </>
              )}
              
              {/* Page numbers */}
              {pageNumbers.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(category, page)}
                    isActive={current === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              {/* Last page */}
              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <PaginationItem>
                      <span className="px-3 py-2 text-muted-foreground">...</span>
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(category, totalPages)}
                      className="cursor-pointer"
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => current < totalPages && handlePageChange(category, current + 1)}
                  className={current >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    );
  };

  // Professional table renders
  const renderFlowsList = (flows: any[], totalCount: number) => (
    <div className="space-y-4">
      <div className="overflow-hidden border border-border rounded-lg bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/30">
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Name
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Running Status
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Deployment Status
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Type of Mediation
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Last Update Date
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Last Updated By
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm">No flows found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              flows.map((flow: any) => {
                const runningStatus = flow.running_status || 'Stopped';
                const isDeployed = flow.is_deployed;
                
                return (
                  <TableRow 
                    key={flow.id} 
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <div>
                        <div className="font-medium text-foreground">{flow.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge 
                        variant="outline"
                        className={`text-xs font-medium ${
                          runningStatus === 'Running' ? 'bg-success text-success-foreground border-success' :
                          runningStatus === 'Partial' ? 'bg-warning text-warning-foreground border-warning' :
                          'bg-destructive text-destructive-foreground border-destructive'
                        }`}
                      >
                        {runningStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge 
                        variant="outline"
                        className={`text-xs font-medium ${
                          isDeployed ? 'bg-success text-success-foreground border-success' : 'bg-warning text-warning-foreground border-warning'
                        }`}
                      >
                        {isDeployed ? "Deployed" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {flow.mediation_type || 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {flow.updated_at ? new Date(flow.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {flow.updated_by || 'System'}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2" 
                          onClick={() => navigate(`/flows/${flow.id}`)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2" 
                          onClick={() => handleExportFlow(flow)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2" 
                          onClick={() => handleCloneFlow(flow)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-destructive hover:text-destructive" 
                          onClick={() => handleDeleteFlow(flow.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {renderPagination('flows', totalCount)}
    </div>
  );

  const renderNodesList = (nodes: any[], totalCount: number) => (
    <div className="space-y-4">
      <div className="overflow-hidden border border-border rounded-lg bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/30">
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Name
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Description
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Published Version
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Last Update Date
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Created By
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(nodes) && nodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm">No nodes found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              nodes.map((node: any) => {
                const isDeployed = node.is_deployed;
                const publishedVersion = node.published_version?.version || 'N/A';
                
                return (
                  <TableRow 
                    key={node.id} 
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <div>
                        <div className="font-medium text-foreground">{node.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {node.description || 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge 
                        variant="outline"
                        className={`text-xs font-medium ${
                          isDeployed ? 'bg-success text-success-foreground border-success' : 'bg-warning text-warning-foreground border-warning'
                        }`}
                      >
                        {isDeployed ? "Deployed" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {publishedVersion}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {node.updated_at ? new Date(node.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {node.created_by || 'System'}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2" 
                          onClick={() => navigate(`/nodes/${node.id}`)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2" 
                          onClick={() => handleExportNode(node)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2" 
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-destructive hover:text-destructive" 
                          onClick={() => handleDeleteNode(node.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {renderPagination('nodes', totalCount)}
    </div>
  );

  const renderSubnodesList = (subnodes: any[], totalCount: number) => (
    <div className="space-y-4">
      <div className="overflow-hidden border border-border rounded-lg bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/30">
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Name
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Node Name
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active Version
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Last Update Date
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Last Updated By
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subnodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm">No subnodes found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              subnodes.map((subnode: any) => {
                const status = subnode.status || 'Drafted';
                const isActive = status === 'Active';
                
                return (
                  <TableRow 
                    key={subnode.id} 
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <div>
                        <div className="font-medium text-foreground">{subnode.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge 
                        variant="outline"
                        className={`text-xs font-medium ${
                          isActive ? 'bg-success text-success-foreground border-success' : 'bg-warning text-warning-foreground border-warning'
                        }`}
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {subnode.node_family_name || 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {subnode.active_version || 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {subnode.updated_at ? new Date(subnode.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {subnode.updated_by || 'System'}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2" 
                          onClick={() => navigate(`/subnodes/${subnode.id}`)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2" 
                          onClick={() => handleExportSubnode(subnode)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2" 
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-destructive hover:text-destructive" 
                          onClick={() => handleDeleteSubnode(subnode.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {renderPagination('subnodes', totalCount)}
    </div>
  );

  const renderParametersList = (parameters: any[], totalCount: number) => (
    <div className="space-y-4">
      <div className="overflow-hidden border border-border rounded-lg bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/30">
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Parameter Name
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Default Value
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Data Type
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Last Updated By
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Last Update Date
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parameters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm">No parameters found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              parameters.map((parameter: any) => (
                <TableRow 
                  key={parameter.id} 
                  className="hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="px-6 py-4">
                    <div>
                      <div className="font-medium text-foreground">{parameter.key}</div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                    {parameter.default_value || 'N/A'}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline" className="text-xs">
                      {parameter.datatype || 'String'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge 
                      variant="outline"
                      className={`text-xs font-medium ${
                        parameter.is_active ? 'bg-success text-success-foreground border-success' : 'bg-warning text-warning-foreground border-warning'
                      }`}
                    >
                      {parameter.is_active ? "Active" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                    {parameter.created_by || 'System'}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                    {parameter.created_at ? new Date(parameter.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'N/A'}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2" 
                          onClick={() => navigate(`/parameters/${parameter.id}`)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2" 
                          onClick={() => handleExportParameter(parameter)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2" 
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-destructive hover:text-destructive" 
                          onClick={() => handleDeleteParameter(parameter.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {renderPagination('parameters', totalCount)}
    </div>
  );

  const fetchLatestGit = async () => {
    if (!gitLoading) {
      await fetchGitInfo();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gitLoading) {
        void fetchLatestGit();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [gitLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Header Section */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-200/20">
                <Settings className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Developer Tools</h1>
                <p className="text-muted-foreground">Comprehensive development and management utilities</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-6 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
        </div>

        {/* Enhanced Tabs */}
        <div className="shadow-lg border border-border rounded-lg bg-card/50 backdrop-blur-sm">
          <div className="p-0">
            <Tabs defaultValue="flows" className="w-full">
              <div className="border-b border-border bg-muted/30 px-6 py-4">
                <TabsList className="bg-background/50 border border-border shadow-sm">
                  <TabsTrigger value="flows" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Workflow className="mr-2 h-4 w-4" />
                    Flows
                  </TabsTrigger>
                  <TabsTrigger value="nodes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Database className="mr-2 h-4 w-4" />
                    Nodes
                  </TabsTrigger>
                  <TabsTrigger value="subnodes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Network className="mr-2 h-4 w-4" />
                    Subnodes
                  </TabsTrigger>
                  <TabsTrigger value="parameters" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Grid3X3 className="mr-2 h-4 w-4" />
                    Parameters
                  </TabsTrigger>
                  <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Activity className="mr-2 h-4 w-4" />
                    Event Management
                  </TabsTrigger>
                  <TabsTrigger value="configs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Settings className="mr-2 h-4 w-4" />
                    Config Management
                  </TabsTrigger>
                  <TabsTrigger value="node-packages" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Package className="mr-2 h-4 w-4" />
                    Node Package Registry
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="flows" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-semibold text-foreground">Flow Management</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                          <span className="font-semibold">Total:</span> {flows.length}
                        </Badge>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20 px-3 py-1">
                          <span className="font-semibold">Active:</span> {flows.filter(f => f.is_deployed).length}
                        </Badge>
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 px-3 py-1">
                          <span className="font-semibold">Draft:</span> {flows.filter(f => !f.is_deployed).length}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Import Flow
                      </Button>
                      <Button onClick={() => setShowCreateFlowDialog(true)} className="bg-success text-success-foreground hover:bg-success/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Flow
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
                            placeholder="Search flows by name..."
                            value={flowSearchTerm}
                            onChange={(e) => setFlowSearchTerm(e.target.value)}
                            className="pl-10 surface-interactive"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Select value={flowStatusFilter} onValueChange={setFlowStatusFilter}>
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
                  
                  {flowsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-muted-foreground">Loading flows...</p>
                      </div>
                    </div>
                  ) : (
                    renderFlowsList(getPaginatedItems(filteredFlows, 'flows'), filteredFlows.length)
                  )}
                </div>
              </TabsContent>

              <TabsContent value="nodes" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-semibold text-foreground">Node Management</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                          <span className="font-semibold">Total:</span> {nodes.length}
                        </Badge>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20 px-3 py-1">
                          <span className="font-semibold">Active:</span> {nodes.filter(n => n.is_deployed).length}
                        </Badge>
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 px-3 py-1">
                          <span className="font-semibold">Draft:</span> {nodes.filter(n => !n.is_deployed).length}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Import Node
                      </Button>
                      <Button onClick={() => navigate('/nodes/new')} className="bg-success text-success-foreground hover:bg-success/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Node
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
                            placeholder="Search nodes by name..."
                            value={nodeSearchTerm}
                            onChange={(e) => setNodeSearchTerm(e.target.value)}
                            className="pl-10 surface-interactive"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Select value={nodeStatusFilter} onValueChange={setNodeStatusFilter}>
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
                  
                  {nodesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-info"></div>
                        <p className="text-muted-foreground">Loading nodes...</p>
                      </div>
                    </div>
                  ) : (
                    renderNodesList(getPaginatedItems(Array.isArray(filteredNodes) ? filteredNodes : [], 'nodes'), Array.isArray(filteredNodes) ? filteredNodes.length : 0)
                  )}
                </div>
              </TabsContent>

              <TabsContent value="subnodes" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-semibold text-foreground">Subnode Management</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                          <span className="font-semibold">Total:</span> {subnodesData?.total_subnodes_number || 0}
                        </Badge>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20 px-3 py-1">
                          <span className="font-semibold">Active:</span> {subnodesData?.total_active_subnodes_number || 0}
                        </Badge>
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 px-3 py-1">
                          <span className="font-semibold">Draft:</span> {subnodesData?.total_drafted_subnodes_number || 0}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Import Subnode
                      </Button>
                      <Button onClick={() => navigate('/subnodes/create')} className="bg-success text-success-foreground hover:bg-success/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Subnode
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
                            placeholder="Search subnodes by name..."
                            value={subnodeSearchTerm}
                            onChange={(e) => setSubnodeSearchTerm(e.target.value)}
                            className="pl-10 surface-interactive"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Select value={subnodeStatusFilter} onValueChange={setSubnodeStatusFilter}>
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
                  
                  {subnodesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warning"></div>
                        <p className="text-muted-foreground">Loading subnodes...</p>
                      </div>
                    </div>
                  ) : (
                    renderSubnodesList(getPaginatedItems(filteredSubnodes, 'subnodes'), filteredSubnodes.length)
                  )}
                </div>
              </TabsContent>

              <TabsContent value="parameters" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-semibold text-foreground">Parameter Management</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                          <span className="font-semibold">Total:</span> {parametersData?.total || 0}
                        </Badge>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20 px-3 py-1">
                          <span className="font-semibold">Active:</span> {parametersData?.published || 0}
                        </Badge>
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 px-3 py-1">
                          <span className="font-semibold">Draft:</span> {parametersData?.draft_count || 0}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Import Parameters
                      </Button>
                      <Button onClick={() => navigate('/parameters/new')} className="bg-success text-success-foreground hover:bg-success/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Parameter
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
                            placeholder="Search parameters by name..."
                            value={parameterSearchTerm}
                            onChange={(e) => setParameterSearchTerm(e.target.value)}
                            className="pl-10 surface-interactive"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Select value={parameterTypeFilter} onValueChange={setParameterTypeFilter}>
                          <SelectTrigger className="w-[160px] surface-interactive">
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border border-border shadow-lg z-50">
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  {parametersLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-success"></div>
                        <p className="text-muted-foreground">Loading parameters...</p>
                      </div>
                    </div>
                  ) : (
                    renderParametersList(getPaginatedItems(filteredParameters, 'parameters'), filteredParameters.length)
                  )}
                </div>
              </TabsContent>

              {/* Event Management Tab */}
              <TabsContent value="events" className="p-6">
                <EventManagementPage />
              </TabsContent>

              {/* Config Management Tab */}
              <TabsContent value="configs" className="p-6">
                <ConfigManagementPage />
              </TabsContent>

              {/* Node Package Registry Tab */}
              <TabsContent value="node-packages" className="p-6">
                <NodePackageListPage />
              </TabsContent>

            </Tabs>
          </div>
        </div>

        {/* Dialogs */}
        <CreateFlowDialog 
          open={showCreateFlowDialog} 
          onOpenChange={setShowCreateFlowDialog} 
        />
        
        <CloneFlowDialog 
          open={showCloneFlowDialog} 
          onOpenChange={setShowCloneFlowDialog} 
          sourceFlow={flowToClone}
          onClone={(sourceFlow, newName, newDescription) => {
            const clonedFlow = {
              ...sourceFlow,
              id: Date.now().toString(),
              name: newName,
              description: newDescription,
              is_active: false,
              is_deployed: false,
              created_at: new Date().toISOString(),
              created_by: "Current User"
            };
            setFlows([...flows, clonedFlow]);
            navigate(`/flows/${clonedFlow.id}/edit`);
          }}
        />
      </div>
    </div>
  );
}
