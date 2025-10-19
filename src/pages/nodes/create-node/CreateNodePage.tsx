import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { nodeService } from "@/services/nodeService";
import { Upload, FileCode, ArrowLeft } from "lucide-react";

export function CreateNodePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [familyName, setFamilyName] = useState("");
  const [description, setDescription] = useState("");
  const [packageZip, setPackageZip] = useState<File | null>(null);
  const [versionNote, setVersionNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPackageZip(file);
    }
  };

  const handleSave = async () => {
    if (!familyName.trim()) {
      toast({
        title: "Error",
        description: "Node family name is required",
        variant: "destructive"
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Description is required",
        variant: "destructive"
      });
      return;
    }

    if (!packageZip) {
      toast({
        title: "Error", 
        description: "Package zip file is required",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Create Node Family
      const newNodeFamily = await nodeService.createNodeFamily({
        name: familyName,
        description: description,
        created_by: "Efrem"
      });

      // Step 2: Upload Node Package
      const packageData = await nodeService.uploadNodePackage(
        newNodeFamily.id,
        packageZip,
        versionNote || "Initial package upload"
      );

      // Step 3: Create Node Version
      await nodeService.createNodeVersion(newNodeFamily.id, {
        version: 1,
        changelog: "version one"
      });

      toast({
        title: "Success",
        description: "Node family created successfully with initial package and version."
      });
      
      navigate("/nodes");
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to create node";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      console.error("Create node error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/nodes");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/devtool")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Node</h1>
            <p className="text-muted-foreground mt-1">
              Create a new processing node with custom script functionality
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="familyName" className="text-sm font-semibold">
                    Node Family Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="familyName"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    placeholder="e.g., sftp-collector"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the node family's purpose and functionality"
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Package Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Node Package
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="packageZip" className="text-sm font-semibold">
                    Package File (.zip) <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="packageZip"
                      type="file"
                      accept=".zip"
                      onChange={handleFileUpload}
                      className="h-11 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {packageZip && (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                      <FileCode className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{packageZip.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {(packageZip.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="versionNote" className="text-sm font-semibold">
                    Package Note
                  </Label>
                  <Input
                    id="versionNote"
                    value={versionNote}
                    onChange={(e) => setVersionNote(e.target.value)}
                    placeholder="e.g., Initial release"
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional note about this package upload
                  </p>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Upload a .zip file containing your node's processing logic
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className="w-full h-11"
                >
                  {isLoading ? "Creating Node..." : "Create Node"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel} 
                  disabled={isLoading}
                  className="w-full h-11"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">Node Family Name</p>
                  <p>Use a clear, descriptive name (e.g., sftp-collector, diameter-interface)</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Package Requirements</p>
                  <p>Upload a .zip file containing your node's processing logic and dependencies</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Automatic Process</p>
                  <p>The system will automatically create the family, upload the package, and create version 1</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}