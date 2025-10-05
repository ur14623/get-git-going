import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { nodeService } from "@/services/nodeService";
import { useEffect } from "react";
import { parameterService } from "@/services/parameterService";
import { useToast } from "@/hooks/use-toast";

export function CreateParameterPage() {
  const navigate = useNavigate();
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
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    key: "",
    default_value: "",
    required: true,
    datatype: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.key) {
      toast({
        title: "Validation Error",
        description: "Parameter key is required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newParameter = await parameterService.createParameter({
        key: formData.key,
        default_value: formData.default_value,
        required: formData.required,
        datatype: formData.datatype || "string",
      });

      toast({
        title: "Parameter created successfully",
        description: `Parameter "${newParameter.key}" has been created.`,
      });

      navigate(`/parameters/${newParameter.id}`);
    } catch (error: any) {
      console.error('Error creating parameter:', error);
      toast({
        title: "Error creating parameter",
        description: error.response?.data?.detail || "Failed to create parameter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    navigate("/parameters");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/devtool?tab=parameters")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Parameter</h1>
            <p className="text-muted-foreground mt-1">
              Define a new configuration parameter for your nodes
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="key" className="text-sm font-semibold">
                    Parameter Key <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="key"
                    value={formData.key}
                    onChange={(e) => handleInputChange("key", e.target.value)}
                    placeholder="e.g., timeout, threshold, batch_size"
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default_value" className="text-sm font-semibold">
                    Default Value
                  </Label>
                  <Input
                    id="default_value"
                    value={formData.default_value}
                    onChange={(e) => handleInputChange("default_value", e.target.value)}
                    placeholder="e.g., 30, true, example_value"
                    className="h-11"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="datatype" className="text-sm font-semibold">
                    Data Type
                  </Label>
                  <Select 
                    value={formData.datatype} 
                    onValueChange={(value) => handleInputChange("datatype", value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="integer">Integer</SelectItem>
                      <SelectItem value="float">Float</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="datetime">DateTime</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="file">File</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-1">
                    <Label className="text-sm font-semibold">Required Parameter</Label>
                    <p className="text-sm text-muted-foreground">
                      Mark as required if this parameter must have a value
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="required" className="text-sm font-medium">
                      {formData.required ? "Required" : "Optional"}
                    </Label>
                    <Switch
                      id="required"
                      checked={formData.required}
                      onCheckedChange={(checked) => handleInputChange("required", checked)}
                    />
                  </div>
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
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11"
                >
                  {isSubmitting ? "Creating..." : "Save"}
                </Button>
                <Button
                  type="button"
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
                  <p className="font-medium text-foreground">Parameter Key</p>
                  <p>Use a descriptive, lowercase key with underscores (e.g., max_retries)</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Data Types</p>
                  <p>Choose the appropriate type based on the expected parameter value format</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Default Value</p>
                  <p>Provide a sensible default that works in most scenarios</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}