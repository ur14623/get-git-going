import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// Mock interface - replace with actual API types
export interface ReleaseNote {
  node_family_name: string;
  version: string;
  release_notes: string;
  state: "Draft" | "Published" | "Archived";
  uploaded_at: string;
}

export function ReleaseNotePage() {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [releaseNote, setReleaseNote] = useState<ReleaseNote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReleaseNote = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await nodePackageService.getReleaseNotes(packageId);
        const mockData: ReleaseNote = {
          node_family_name: "Data Processor",
          version: "1.0.0",
          state: "Published",
          uploaded_at: "2025-01-15T10:30:00Z",
          release_notes: `# Release Notes for Data Processor v1.0.0

## New Features
- Added support for CSV file processing
- Implemented data validation pipeline
- Added error logging and reporting
- Support for batch processing

## Improvements
- Optimized memory usage by 30%
- Enhanced error handling
- Improved processing speed for large datasets

## Bug Fixes
- Fixed issue with special characters in file names
- Resolved memory leak in batch processing
- Fixed date parsing for international formats

## Breaking Changes
- Changed API endpoint structure
- Updated configuration file format

## Migration Guide
To upgrade from previous versions:
1. Update your configuration files to use new format
2. Review API endpoint changes
3. Test with sample data before production use

## Known Issues
- Performance may be slower on datasets larger than 10GB
- Limited support for Excel files with macros

## Dependencies
- Python 3.9+
- pandas 2.0+
- numpy 1.24+

For more information, visit the documentation or contact support.`
        };
        setReleaseNote(mockData);
      } catch (error) {
        console.error("Failed to fetch release notes:", error);
        toast({
          title: "Error",
          description: "Failed to load release notes",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (packageId) {
      fetchReleaseNote();
    }
  }, [packageId, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
            Loading release notes...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!releaseNote) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Release notes not found
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
          onClick={() => navigate(`/devtool/node-packages/${packageId}`)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">
              {releaseNote.node_family_name} v{releaseNote.version}
            </h1>
            <Badge variant={getStateBadgeVariant(releaseNote.state)}>
              {releaseNote.state}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Released on {formatDate(releaseNote.uploaded_at)}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Release Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {releaseNote.release_notes}
            </pre>
          </div>
          
          <div className="flex gap-4 pt-6 mt-6 border-t">
            <Button
              variant="outline"
              onClick={() => navigate(`/devtool/node-packages/${packageId}`)}
            >
              Back to Package Details
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/devtool")}
            >
              Back to List
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
