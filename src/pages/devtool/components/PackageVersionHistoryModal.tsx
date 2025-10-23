import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Clock, User } from "lucide-react";

interface PackageVersion {
  id: string;
  version: number;
  state: string;
  status: string;
  uploaded_at: string;
  uploaded_by: string;
  description: string;
  changelog?: string;
  is_active: boolean;
  linked_node_version?: {
    id: string;
    version: number;
    is_active: boolean;
    deployed_at: string;
  } | null;
}

interface PackageVersionHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  versions: PackageVersion[];
  selectedVersion: PackageVersion | null;
  onSelectVersion: (version: PackageVersion) => void;
}

export function PackageVersionHistoryModal({
  open,
  onOpenChange,
  versions,
  selectedVersion,
  onSelectVersion,
}: PackageVersionHistoryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
          <DialogDescription>
            Select a version to view its details. Activation is managed by the node.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {versions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Uploaded At</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.map((version) => (
                  <TableRow 
                    key={version.id}
                    className={selectedVersion?.id === version.id ? "bg-muted/50" : ""}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={version.state === 'published' ? "default" : "outline"}>
                          v{version.version}
                        </Badge>
                        {version.is_active && (
                          <Badge className="bg-success text-white">Active</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {version.state === 'published' ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="text-foreground font-medium">Published</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Draft</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{version.uploaded_by}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(version.uploaded_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {version.description || version.changelog || 'No description'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onSelectVersion(version)}
                      >
                        {selectedVersion?.id === version.id ? 'Selected' : 'View'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No version history available
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
