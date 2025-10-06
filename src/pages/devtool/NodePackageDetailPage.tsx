import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export interface NodePackageDetail {
  id: string;
  node_family: string;
  node_family_name: string;
  version: number;
  package_zip: string | null;
  package_url: string | null;
  extracted_path: string | null;
  extracted_path_display: string | null;
  entry_point: string | null;
  package_hash: string | null;
  state: string;
  uploaded_by: string;
  uploaded_at: string;
}

export function NodePackageDetailPage() {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [packageDetail, setPackageDetail] = useState<NodePackageDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackageDetail = async () => {
      try {
        const response = await axios.get<NodePackageDetail>(`${API_BASE_URL}/node-packages/${packageId}/`);
        setPackageDetail(response.data);
      } catch (error) {
        console.error("Failed to fetch package detail:", error);
        toast({
          title: "Error",
          description: "Failed to load package details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (packageId) {
      fetchPackageDetail();
    }
  }, [packageId, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStateBadgeVariant = (state: string) => {
    const lowerState = state.toLowerCase();
    switch (lowerState) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "archived":
        return "outline";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8 text-center">
            Loading package details...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!packageDetail) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Package not found
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/devtool")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{packageDetail.node_family_name}</h1>
          <p className="text-muted-foreground">Version {packageDetail.version}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Package Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Node Family</Label>
              <p className="font-medium">{packageDetail.node_family_name}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Version</Label>
              <p className="font-medium">{packageDetail.version}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">State</Label>
              <div>
                <Badge variant={getStateBadgeVariant(packageDetail.state)}>
                  {packageDetail.state.charAt(0).toUpperCase() + packageDetail.state.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Entry Point</Label>
              <p className="font-mono text-sm">{packageDetail.entry_point || "—"}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Uploaded By</Label>
              <p>{packageDetail.uploaded_by || "—"}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Uploaded At</Label>
              <p>{formatDate(packageDetail.uploaded_at)}</p>
            </div>

            {packageDetail.package_url && (
              <div className="space-y-2 md:col-span-2">
                <Label className="text-muted-foreground">Package URL</Label>
                <a 
                  href={packageDetail.package_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-primary hover:underline break-all"
                >
                  {packageDetail.package_url}
                </a>
              </div>
            )}

            {packageDetail.package_hash && (
              <div className="space-y-2 md:col-span-2">
                <Label className="text-muted-foreground">Package Hash</Label>
                <p className="font-mono text-xs break-all bg-muted p-2 rounded">
                  {packageDetail.package_hash}
                </p>
              </div>
            )}

            {packageDetail.extracted_path_display && (
              <div className="space-y-2 md:col-span-2">
                <Label className="text-muted-foreground">Extracted Path</Label>
                <p className="font-mono text-sm">{packageDetail.extracted_path_display}</p>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              onClick={() => navigate(`/devtool/node-packages/${packageDetail.id}/release-notes`)}
            >
              <FileText className="mr-2 h-4 w-4" />
              View Release Notes
            </Button>
            <Button variant="outline" onClick={() => navigate("/devtool")}>
              Back to List
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
