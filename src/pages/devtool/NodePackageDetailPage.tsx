import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { UniformDetailBackButton } from "@/components/UniformDetailBackButton";
import { LoadingSpinner } from "@/components/ui/loading";
import { History } from "lucide-react";
import axios from 'axios';
import { PackageVersionHistoryModal } from "./components/PackageVersionHistoryModal";

interface PackageVersion {
  id: string;
  version: number;
  state: string;
  status: string;
  uploaded_at: string;
  uploaded_by: string;
  description: string;
  package_zip?: string;
  package_url?: string;
  extracted_path?: string;
  extracted_path_display?: string;
  entry_point?: string;
  package_hash?: string;
  can_publish: boolean;
  is_active: boolean;
  release_version_note?: string;
  changelog?: string;
  linked_node_version?: {
    id: string;
    version: number;
    is_active: boolean;
    deployed_at: string;
  } | null;
}

interface NodePackageDetail {
  id: string;
  name: string;
  description: string;
  node_family: string;
  node_family_name: string;
  is_deployed: boolean;
  active_package_version?: number;
  latest_version: number;
  total_versions: number;
  created_by: string;
  created_at: string;
  last_updated_by: string;
  last_updated_at: string;
  last_version?: PackageVersion;
  versions: PackageVersion[];
}

export function NodePackageDetailPage() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [packageDetail, setPackageDetail] = useState<NodePackageDetail | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<PackageVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);

  useEffect(() => {
    const fetchPackageDetail = async () => {
      if (!packageId) return;
      
      try {
        const response = await axios.get(`http://127.0.0.1:8000/node_package/${packageId}/`);
        setPackageDetail(response.data);
        
        // Set selected version to active version or last version
        const activeVersion = response.data.versions?.find((v: PackageVersion) => v.is_active);
        const versionToShow = activeVersion || response.data.last_version || response.data.versions?.[0];
        setSelectedVersion(versionToShow);
      } catch (err: any) {
        console.error("Error fetching package detail:", err);
        toast({
          title: "Error",
          description: "Failed to load package details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetail();
  }, [packageId, toast]);

  const handleShowVersionHistory = () => {
    setVersionHistoryOpen(true);
  };

  const handleSelectVersion = (version: PackageVersion) => {
    setSelectedVersion(version);
    setVersionHistoryOpen(false);
    toast({
      title: "Version Selected",
      description: `Now viewing version ${version.version}`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStateBadgeVariant = (state: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (state.toLowerCase()) {
      case 'published':
        return 'default';
      case 'draft':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!packageDetail) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Package not found</p>
        <Button onClick={() => navigate('/devtool')} className="mt-4">
          Back to DevTool
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <UniformDetailBackButton backRoute="/devtool" />
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{packageDetail.name}</h1>
              {selectedVersion && (
                <Badge variant="outline" className="text-base">
                  v{selectedVersion.version}
                </Badge>
              )}
              <Badge variant={getStateBadgeVariant(selectedVersion?.state || 'draft')}>
                {selectedVersion?.is_active ? 'Active' : selectedVersion?.state || 'Draft'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Node Family: {packageDetail.node_family_name}
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={handleShowVersionHistory}
          className="gap-2"
        >
          <History className="h-4 w-4" />
          Version History
        </Button>
      </div>

      <Separator />

      {/* Package Summary */}
      <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Description</p>
            <p className="font-medium">{packageDetail.description}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Versions</p>
            <p className="font-medium">{packageDetail.total_versions}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Latest Version</p>
            <p className="font-medium">v{packageDetail.latest_version}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Created By</p>
            <p className="font-medium">{packageDetail.created_by}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Created At</p>
            <p className="font-medium">{formatDate(packageDetail.created_at)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
            <p className="font-medium">{formatDate(packageDetail.last_updated_at)}</p>
          </div>
        </div>
      </div>

      {/* Version Details */}
      {selectedVersion && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Version {selectedVersion.version} Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Card */}
            <div className="bg-card border rounded-lg p-5 space-y-2 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Status</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStateBadgeVariant(selectedVersion.state)}>
                  {selectedVersion.state}
                </Badge>
                <Badge variant="outline">{selectedVersion.status}</Badge>
                {selectedVersion.is_active && (
                  <Badge className="bg-success text-white">Active</Badge>
                )}
              </div>
            </div>

            {/* Entry Point Card */}
            <div className="bg-card border rounded-lg p-5 space-y-2 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span className="text-sm font-medium">Entry Point</span>
              </div>
              <p className="text-sm font-mono text-foreground/90">{selectedVersion.entry_point || '—'}</p>
            </div>

            {/* Uploaded By Card */}
            <div className="bg-card border rounded-lg p-5 space-y-2 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium">Uploaded By</span>
              </div>
              <p className="text-sm text-foreground/90">{selectedVersion.uploaded_by}</p>
            </div>

            {/* Upload Date Card */}
            <div className="bg-card border rounded-lg p-5 space-y-2 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Uploaded At</span>
              </div>
              <p className="text-sm text-foreground/90">{new Date(selectedVersion.uploaded_at).toLocaleString()}</p>
            </div>
          </div>

          {/* Description Card */}
          {selectedVersion.description && (
            <div className="bg-card border rounded-lg p-5 space-y-2 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium">Description</span>
              </div>
              <p className="text-sm text-foreground/90">{selectedVersion.description}</p>
            </div>
          )}

          {/* Changelog Card */}
          {selectedVersion.changelog && (
            <div className="bg-card border rounded-lg p-5 space-y-2 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium">Changelog</span>
              </div>
              <p className="text-sm text-foreground/90">{selectedVersion.changelog}</p>
            </div>
          )}

          {/* Package URL Card */}
          {selectedVersion.package_url && (
            <div className="bg-card border rounded-lg p-5 space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-sm font-medium">Package URL</span>
              </div>
              <a 
                href={selectedVersion.package_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline break-all"
              >
                {selectedVersion.package_url}
              </a>
            </div>
          )}

          {/* Package Hash Card */}
          {selectedVersion.package_hash && (
            <div className="bg-card border rounded-lg p-5 space-y-2 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="text-sm font-medium">Package Hash</span>
              </div>
              <p className="text-xs font-mono text-foreground/90 break-all">{selectedVersion.package_hash}</p>
            </div>
          )}

          {/* Extracted Path Card */}
          {selectedVersion.extracted_path_display && (
            <div className="bg-card border rounded-lg p-5 space-y-2 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span className="text-sm font-medium">Extracted Path</span>
              </div>
              <p className="text-sm font-mono text-foreground/90">{selectedVersion.extracted_path_display}</p>
            </div>
          )}

          {/* Linked Node Version Card */}
          {selectedVersion.linked_node_version && (
            <div className="bg-card border rounded-lg p-5 space-y-2 hover:shadow-md transition-shadow col-span-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-medium">Linked Node Version</span>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm text-foreground/90">Version {selectedVersion.linked_node_version.version}</p>
                {selectedVersion.linked_node_version.is_active && (
                  <Badge className="bg-success text-white">Active</Badge>
                )}
                <p className="text-xs text-muted-foreground">
                  Deployed at: {new Date(selectedVersion.linked_node_version.deployed_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Version History Modal */}
      <PackageVersionHistoryModal
        open={versionHistoryOpen}
        onOpenChange={setVersionHistoryOpen}
        versions={packageDetail.versions || []}
        selectedVersion={selectedVersion}
        onSelectVersion={handleSelectVersion}
      />
    </div>
  );
}
