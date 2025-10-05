import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

// Mock interface - replace with actual API types
export interface NodePackageDetail {
  id: string;
  node_family_name: string;
  version: string;
  version_note: string;
  state: "Draft" | "Published" | "Archived";
  uploaded_by: string;
  uploaded_at: string;
  entry_point: string;
  sha256_hash: string;
  extracted_path?: string;
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
        // TODO: Replace with actual API call
        // const response = await nodePackageService.getPackageDetail(packageId);
        const mockData: NodePackageDetail = {
          id: packageId || "1",
          node_family_name: "Data Processor",
          version: "1.0.0",
          version_note: "Initial release with basic data processing capabilities",
          state: "Published",
          uploaded_by: "john.doe@example.com",
          uploaded_at: "2025-01-15T10:30:00Z",
          entry_point: "main.py",
          sha256_hash: "a3b5c7d9e1f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4",
          extracted_path: "/packages/data-processor/1.0.0"
        };
        setPackageDetail(mockData);
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
                  {packageDetail.state}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Entry Point</Label>
              <p className="font-mono text-sm">{packageDetail.entry_point}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Uploaded By</Label>
              <p>{packageDetail.uploaded_by}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Uploaded At</Label>
              <p>{formatDate(packageDetail.uploaded_at)}</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-muted-foreground">SHA256 Hash</Label>
              <p className="font-mono text-xs break-all bg-muted p-2 rounded">
                {packageDetail.sha256_hash}
              </p>
            </div>

            {packageDetail.extracted_path && (
              <div className="space-y-2 md:col-span-2">
                <Label className="text-muted-foreground">Extracted Path</Label>
                <p className="font-mono text-sm">{packageDetail.extracted_path}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Version Note</Label>
            <p className="text-sm leading-relaxed">{packageDetail.version_note}</p>
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
