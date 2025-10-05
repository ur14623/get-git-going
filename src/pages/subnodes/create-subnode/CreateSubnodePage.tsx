import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { nodeService } from "@/services/nodeService";
import { subnodeService } from "@/services/subnodeService";

export function CreateSubnodePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [nodes, setNodes] = useState<any[]>([]);
  const [nodesLoading, setNodesLoading] = useState(true);
  const [nodesError, setNodesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const nodeList = await nodeService.getAllNodes();
        setNodes(nodeList);
      } catch (err: any) {
        setNodesError(err.message || 'Failed to fetch nodes');
      } finally {
        setNodesLoading(false);
      }
    };
    fetchNodes();
  }, []);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    node_family: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    // Validate form
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Subnode name is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.node_family) {
      toast({
        title: "Validation Error",
        description: "Please select a parent node",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newSubnode = await subnodeService.createSubnode({
        name: formData.name,
        description: formData.description,
        node_family: formData.node_family
      });
      
      toast({
        title: "Success",
        description: "Subnode created successfully"
      });
      
      // Navigate to subnodes list page, since we don't have the full subnode detail from create response
      navigate('/subnodes');
    } catch (error: any) {
      console.error("Create subnode error:", error);
      toast({
        title: "Error", 
        description: error.response?.data?.detail || error.response?.data?.error || "Failed to create subnode",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/subnodes');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/devtool?tab=subnodes")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Subnode</h1>
            <p className="text-muted-foreground mt-1">
              Create a new subnode under an existing node family
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
                {nodesError && (
                  <div className="text-destructive text-sm mb-4 p-3 bg-destructive/10 rounded-md">
                    Error loading nodes: {nodesError}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">
                    Subnode Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter a descriptive subnode name"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the subnode's purpose and functionality"
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Node Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Node Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="parentNode" className="text-sm font-semibold">
                    Select Parent Node <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={formData.node_family}
                    onValueChange={(value) => handleInputChange('node_family', value)}
                    disabled={nodesLoading}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder={nodesLoading ? "Loading nodes..." : "Select a parent node"} />
                    </SelectTrigger>
                    <SelectContent>
                      {nodes?.map((node) => (
                        <SelectItem key={node.id} value={node.id}>
                          {node.name} | {node.mediation_type || 'N/A'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                  disabled={!formData.node_family || isSubmitting || nodesLoading}
                  className="w-full h-11"
                >
                  {isSubmitting ? "Creating..." : "Save"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel} 
                  disabled={isSubmitting}
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
                  <p className="font-medium text-foreground">Subnode Name</p>
                  <p>Use a clear, descriptive name that indicates the subnode's specific functionality</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Parent Node</p>
                  <p>Select the node family that this subnode will belong to</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Description</p>
                  <p>Provide details about the subnode's purpose and how it differs from other subnodes</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}