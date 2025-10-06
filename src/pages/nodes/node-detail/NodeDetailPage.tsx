import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { nodeService, type Node, type NodeVersionDetail } from "@/services/nodeService";
import { parameterService, type Parameter } from "@/services/parameterService";
import { UniformDetailHeader } from "@/components/UniformDetailHeader";
import { UniformDetailBackButton } from "@/components/UniformDetailBackButton";
import { NodeSummary } from "./components/NodeSummary";
import { PropertiesSection } from "./components/PropertiesSection";
import { SubnodesSection } from "./components/SubnodesSection";
import { VersionHistoryModal } from "./components/VersionHistoryModal";
import { CreateVersionModal } from "./components/CreateVersionModal";
import axios from 'axios';
import { LoadingSpinner } from "@/components/ui/loading";

export function NodeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [node, setNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Version management
  const [nodeVersions, setNodeVersions] = useState<NodeVersionDetail[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<NodeVersionDetail | null>(null);
  const [nodeVersionsLoading, setNodeVersionsLoading] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [createVersionOpen, setCreateVersionOpen] = useState(false);
  
  // Active node checking
  const [currentActiveNode, setCurrentActiveNode] = useState<Node | null>(null);

  // Parameters management
  const [nodeParameters, setNodeParameters] = useState<any[]>([]);

  useEffect(() => {
    const fetchNode = async () => {
      if (!id) return;
      
      try {
        const nodeData = await nodeService.getNode(id);
        setNode(nodeData);
        
        // Initialize with empty parameters, will be set when version is selected
        setNodeParameters([]);
        
        // Fetch initial data
        await fetchNodeVersions();
        
        // Check for currently active node in the system
        const activeNode = await nodeService.getActiveNode();
        setCurrentActiveNode(activeNode);
      } catch (err: any) {
        console.error("Error fetching node:", err);
        setError(err.response?.data?.error || err.message || "Error fetching node");
        toast({
          title: "Error",
          description: "Failed to load node details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNode();
  }, [id, toast]);

  // Fetch node versions
  const fetchNodeVersions = async () => {
    if (!id) return;
    
    setNodeVersionsLoading(true);
    try {
      const versions = await nodeService.getNodeVersions(id);
      setNodeVersions(versions);
      
      // Set selected version to active version or latest
      const activeVersion = versions.find(v => v.state === 'published') || versions[0];
      console.log('🔍 Active version found:', activeVersion);
      console.log('🔍 Subnodes in active version:', activeVersion?.subnodes);
      console.log('🔍 Subnodes length:', activeVersion?.subnodes?.length);
      setSelectedVersion(activeVersion);
      
      // Set parameters from selected version
      if (activeVersion?.parameters) {
        setNodeParameters(activeVersion.parameters);
      }
    } catch (err: any) {
      console.error('Error fetching node versions:', err);
      toast({
        title: "Error",
        description: "Failed to load node versions",
        variant: "destructive"
      });
    } finally {
      setNodeVersionsLoading(false);
    }
  };


  // Event handlers
  const handleEditVersion = () => {
    if (selectedVersion && selectedVersion.state !== 'published') {
      navigate(`/nodes/${id}/edit-version?version=${selectedVersion.version}`);
    }
  };

  const handleCreateNewVersion = () => {
    setCreateVersionOpen(true);
  };

  const handleCreateVersionSubmit = async (changelog: string) => {
    if (!id) return;
    
    try {
      await nodeService.createNodeVersionWithChangelog(id, changelog);
      setCreateVersionOpen(false);
      
      // Refresh versions list
      await fetchNodeVersions();
      
      toast({
        title: "Version Created",
        description: "New version created successfully",
      });
    } catch (error) {
      console.error('Failed to create version:', error);
      toast({
        title: "Error",
        description: "Failed to create new version",
        variant: "destructive"
      });
    }
  };

  const handleToggleDeployment = async () => {
    if (!selectedVersion || !id) return;
    
    try {
      if (selectedVersion.state === 'published') {
        // Undeploy the version
        await nodeService.undeployNodeVersion(id, selectedVersion.version);
        toast({
          title: "Version Undeployed",
          description: `Version ${selectedVersion.version} has been undeployed`,
        });
      } else {
        // Deploy the version (will automatically deactivate other versions of this node)
        await nodeService.deployNodeVersion(id, selectedVersion.version);
        toast({
          title: "Node Activated",
          description: `Node "${node?.name}" version ${selectedVersion.version} is now active`,
        });
      }
      
      // Refresh the page to reflect changes
      window.location.reload();
      
    } catch (err: any) {
      console.error('Error toggling version deployment:', err);
      toast({
        title: "Error",
        description: "Failed to update version deployment status",
        variant: "destructive"
      });
    }
  };

  const handleShowVersionHistory = () => {
    setVersionHistoryOpen(true);
    if (nodeVersions.length === 0) {
      fetchNodeVersions();
    }
  };

  const handleSelectVersion = (version: NodeVersionDetail) => {
    setSelectedVersion(version);
    setVersionHistoryOpen(false);
    // Update parameters for the selected version
    setNodeParameters(version.parameters || []);
    toast({
      title: "Version Selected",
      description: `Now viewing version ${version.version}`,
    });
  };

  const activateNodeVersion = async (version: NodeVersionDetail) => {
    if (!id) return;
    
    try {
      // Deploy the version (will automatically deactivate other versions of this node)
      await nodeService.deployNodeVersion(id, version.version);
      
      toast({
        title: "Node Activated",
        description: `Node "${node?.name}" version ${version.version} is now active`,
      });
      
      // Close modal and redirect to detail page showing the activated version
      setVersionHistoryOpen(false);
      
      // Refresh the page to show the activated version
      window.location.reload();
      
    } catch (err: any) {
      console.error('Error activating node version:', err);
      toast({
        title: "Error",
        description: "Failed to activate version",
        variant: "destructive"
      });
    }
  };

  // Version management handlers
  const handleDeleteVersion = async () => {
    if (!selectedVersion || !id || selectedVersion.state === 'published') {
      toast({
        title: "Cannot Delete Version",
        description: selectedVersion?.state === 'published' ? "Cannot delete a published version" : "No version selected",
        variant: "destructive"
      });
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete version ${selectedVersion.version}? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      // Call API to delete version (you may need to add this to nodeService)
      // await nodeService.deleteNodeVersion(id, selectedVersion.version);
      
      toast({
        title: "Version Deleted",
        description: `Version ${selectedVersion.version} has been deleted`,
      });

      // Refresh versions
      await fetchNodeVersions();
    } catch (err: any) {
      console.error('Error deleting version:', err);
      toast({
        title: "Error",
        description: "Failed to delete version",
        variant: "destructive"
      });
    }
  };

  const handleCloneVersion = async () => {
    if (!selectedVersion || !id) return;

    try {
      // Create new version from current version
      const newVersion = await nodeService.createNewNodeVersion(id, selectedVersion.version);
      
      toast({
        title: "Version Cloned",
        description: `New version ${newVersion.version} created from version ${selectedVersion.version}`,
      });

      // Refresh versions and navigate to edit the new version
      await fetchNodeVersions();
      navigate(`/nodes/${id}/edit-version?version=${newVersion.version}`);
    } catch (err: any) {
      console.error('Error cloning version:', err);
      toast({
        title: "Error",
        description: "Failed to clone version",
        variant: "destructive"
      });
    }
  };

  const handleExportVersion = () => {
    if (!selectedVersion || !node) return;

    const exportData = {
      node: {
        id: node.id,
        name: node.name,
        description: node.description
      },
      version: selectedVersion,
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${node.name}_v${selectedVersion.version}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Version Exported",
      description: `Version ${selectedVersion.version} exported successfully`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error: {error}</p>
        <Button onClick={() => navigate('/nodes')} className="mt-4">
          Back to Nodes
        </Button>
      </div>
    );
  }

  if (!node) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Node not found</p>
        <Button onClick={() => navigate('/nodes')} className="mt-4">
          Back to Nodes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Uniform Header */}
      <UniformDetailHeader
        name={node.name}
        version={selectedVersion?.version || node.published_version?.version}
        status={selectedVersion?.state === 'published' ? 'deployed' : selectedVersion && selectedVersion.state !== 'published' ? 'editable' : 'stopped'}
        backRoute="/devtool"
        backTab="nodes"
        isEditable={selectedVersion && selectedVersion.state !== 'published'}
        onEditVersion={handleEditVersion}
        onCreateNewVersion={handleCreateNewVersion}
        onToggleDeployment={handleToggleDeployment}
        onShowVersionHistory={handleShowVersionHistory}
        onExportVersion={handleExportVersion}
        onCloneVersion={handleCloneVersion}
        onDeleteVersion={handleDeleteVersion}
        onTestAction={() => navigate(`/nodes/${node.id}/test`)}
        isLoading={loading}
      />

      <Separator />

      {/* Node Detail Section */}
      <NodeSummary
        node={node}
        selectedVersion={selectedVersion}
        propertiesCount={nodeParameters.length}
        subnodesCount={selectedVersion?.subnodes?.length || 0}
      />

      {/* Tabbed Sections */}
      <Tabs defaultValue="parameters" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="subnodes">Subnodes</TabsTrigger>
          <TabsTrigger value="package">Package Version</TabsTrigger>
        </TabsList>
        
        <TabsContent value="parameters" className="space-y-4">
          <PropertiesSection
            properties={nodeParameters}
            loading={false}
          />
        </TabsContent>
        
        <TabsContent value="subnodes" className="space-y-4">
          <SubnodesSection
            subnodes={selectedVersion?.subnodes || []}
          />
        </TabsContent>
        
        <TabsContent value="package" className="space-y-4">
          {selectedVersion?.package_version ? (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-semibold">Package Version {selectedVersion.package_version.version}</h3>
                      <Badge 
                        variant={selectedVersion.package_version.state === 'published' ? 'default' : 'secondary'}
                        className="text-sm"
                      >
                        {selectedVersion.package_version.state}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Node Family: {selectedVersion.package_version.node_family_name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Package ID Card */}
                <div className="bg-card border rounded-lg p-5 space-y-2 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-sm font-medium">Package ID</span>
                  </div>
                  <p className="text-sm font-mono text-foreground/90 break-all">{selectedVersion.package_version.id}</p>
                </div>

                {/* Entry Point Card */}
                <div className="bg-card border rounded-lg p-5 space-y-2 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <span className="text-sm font-medium">Entry Point</span>
                  </div>
                  <p className="text-sm font-mono text-foreground/90">{selectedVersion.package_version.entry_point || '—'}</p>
                </div>

                {/* Uploaded By Card */}
                <div className="bg-card border rounded-lg p-5 space-y-2 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm font-medium">Uploaded By</span>
                  </div>
                  <p className="text-sm text-foreground/90">{selectedVersion.package_version.uploaded_by || 'System'}</p>
                </div>

                {/* Upload Date Card */}
                <div className="bg-card border rounded-lg p-5 space-y-2 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">Uploaded At</span>
                  </div>
                  <p className="text-sm text-foreground/90">{new Date(selectedVersion.package_version.uploaded_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Package URL Card */}
              {selectedVersion.package_version.package_url && (
                <div className="bg-card border rounded-lg p-5 space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium">Package URL</span>
                  </div>
                  <a 
                    href={selectedVersion.package_version.package_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all flex items-center gap-2 group"
                  >
                    <span>{selectedVersion.package_version.package_url}</span>
                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}

              {/* Extracted Path Card */}
              {selectedVersion.package_version.extracted_path_display && (
                <div className="bg-card border rounded-lg p-5 space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span className="text-sm font-medium">Extracted Path</span>
                  </div>
                  <p className="text-sm font-mono bg-muted/50 px-3 py-2 rounded border text-foreground/90">
                    {selectedVersion.package_version.extracted_path_display}
                  </p>
                </div>
              )}

              {/* Package Hash Card */}
              {selectedVersion.package_version.package_hash && (
                <div className="bg-card border rounded-lg p-5 space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-sm font-medium">Package Hash (SHA-256)</span>
                  </div>
                  <p className="text-xs font-mono bg-muted/50 px-3 py-2 rounded border break-all text-foreground/90">
                    {selectedVersion.package_version.package_hash}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-muted-foreground">No package version information available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Version History Modal */}
      <VersionHistoryModal
        open={versionHistoryOpen}
        onOpenChange={setVersionHistoryOpen}
        versions={nodeVersions}
        selectedVersion={selectedVersion}
        onSelectVersion={handleSelectVersion}
        onActivateVersion={activateNodeVersion}
        isLoading={nodeVersionsLoading}
      />

      {/* Create Version Modal */}
      <CreateVersionModal
        open={createVersionOpen}
        onOpenChange={setCreateVersionOpen}
        onCreateVersion={handleCreateVersionSubmit}
        isLoading={loading}
      />

      {/* Back Button */}
      <div className="flex justify-end pt-6">
        <UniformDetailBackButton backRoute="/devtool" backTab="nodes" />
      </div>
    </div>
  );
}