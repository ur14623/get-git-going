import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { subnodeService } from "@/services/subnodeService";
import { LoadingCard } from "@/components/ui/loading";

interface ParameterValue {
  parameter_values_id: string;
  parameter_key: string;
  value: string;
  default_value: string;
  datatype: string;
  source: string;
}

export function EditVersionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [subnodeDetail, setSubnodeDetail] = useState<any>(null);
  const [selectedNodeVersion, setSelectedNodeVersion] = useState<number>(1);
  const [parameterValues, setParameterValues] = useState<ParameterValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSubnodeDetail = async () => {
      if (!id) {
        toast.error("Missing subnode ID");
        navigate('/subnodes');
        return;
      }
      
      try {
        setLoading(true);
        const detail = await subnodeService.getSubnode(id);
        setSubnodeDetail(detail);
        
        // Set default selected node version to the last version
        if (detail.versions && detail.versions.length > 0) {
          const latestVersion = detail.versions[0];
          setSelectedNodeVersion(latestVersion.version);
          
          // Find parameter values for the latest version
          if (latestVersion.parameter_values_by_nodeversion) {
            const versionData = latestVersion.parameter_values_by_nodeversion.find(
              (pv: any) => pv.node_version === latestVersion.version
            );
            if (versionData && versionData.parameter_values) {
              // Map the parameter values to include parameter_values_id
              const mappedParams = versionData.parameter_values.map((p: any) => ({
                parameter_values_id: p.parameter_values_id || p.id || '',
                parameter_key: p.parameter_key,
                value: p.value,
                default_value: p.default_value,
                datatype: p.datatype,
                source: p.source
              }));
              setParameterValues(mappedParams);
            }
          }
        }
      } catch (error) {
        toast.error("Failed to load subnode details");
        console.error("Load subnode error:", error);
        navigate('/subnodes');
      } finally {
        setLoading(false);
      }
    };

    loadSubnodeDetail();
  }, [id, navigate]);

  // Update parameter values when node version changes
  useEffect(() => {
    if (!subnodeDetail) return;
    
    const selectedVersion = subnodeDetail.versions.find((v: any) => v.version === selectedNodeVersion);
    if (selectedVersion && selectedVersion.parameter_values_by_nodeversion) {
      const versionData = selectedVersion.parameter_values_by_nodeversion.find(
        (pv: any) => pv.node_version === selectedNodeVersion
      );
      if (versionData && versionData.parameter_values) {
        // Map the parameter values to include parameter_values_id
        const mappedParams = versionData.parameter_values.map((p: any) => ({
          parameter_values_id: p.parameter_values_id || p.id || '',
          parameter_key: p.parameter_key,
          value: p.value,
          default_value: p.default_value,
          datatype: p.datatype,
          source: p.source
        }));
        setParameterValues(mappedParams);
      }
    }
  }, [selectedNodeVersion, subnodeDetail]);

  const handleParameterValueChange = (paramId: string, value: string) => {
    setParameterValues(prev => 
      prev.map(param => 
        param.parameter_values_id === paramId ? { ...param, value } : param
      )
    );
  };

  const handleSave = async () => {
    if (!subnodeDetail || !id) return;
    
    setSaving(true);
    try {
      await subnodeService.updateParameterValues(
        id,
        parameterValues.map(pv => ({
          id: pv.parameter_values_id,
          value: pv.value
        }))
      );
      toast.success("Parameter values updated successfully");
      navigate(`/subnodes/${id}`);
    } catch (error) {
      toast.error("Failed to update parameter values");
      console.error("Update error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/subnodes/${id}`);
  };

  if (loading) {
    return <LoadingCard text="Loading version details..." className="min-h-[400px]" />;
  }

  if (!subnodeDetail) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">Subnode not found</p>
          <Button onClick={handleCancel}>Go Back</Button>
        </div>
      </div>
    );
  }

  const currentVersion = subnodeDetail.versions.find((v: any) => v.version === selectedNodeVersion);
  const availableNodeVersions = subnodeDetail.versions.flatMap((v: any) => 
    v.parameter_values_by_nodeversion?.map((pv: any) => pv.node_version) || []
  ).filter((v: number, i: number, arr: number[]) => arr.indexOf(v) === i).sort((a: number, b: number) => b - a);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Parameter Values</h1>
            <p className="text-muted-foreground">
              Editing parameter values for {subnodeDetail.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={currentVersion?.is_deployed ? "default" : "secondary"}>
            {currentVersion?.is_deployed ? "Deployed" : "Not Deployed"}
          </Badge>
          <Badge variant={currentVersion?.is_editable ? "outline" : "secondary"}>
            {currentVersion?.is_editable ? "Editable" : "Read Only"}
          </Badge>
        </div>
      </div>

      {/* Subnode Information */}
      <Card>
        <CardHeader>
          <CardTitle>Subnode Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <p className="text-sm text-muted-foreground">{subnodeDetail.name}</p>
            </div>
            <div>
              <Label>Subnode Version</Label>
              <p className="text-sm text-muted-foreground">v{currentVersion?.version}</p>
            </div>
            <div>
              <Label>Node Family</Label>
              <p className="text-sm text-muted-foreground">{subnodeDetail.node_family.name}</p>
            </div>
            <div>
              <Label>Version Comment</Label>
              <p className="text-sm text-muted-foreground">
                {currentVersion?.version_comment || "No comment"}
              </p>
            </div>
          </div>
          {subnodeDetail.description && (
            <div>
              <Label>Description</Label>
              <p className="text-sm text-muted-foreground">{subnodeDetail.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Parameter Values */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Parameter Values</CardTitle>
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium">Node Version:</Label>
              <Select
                value={selectedNodeVersion.toString()}
                onValueChange={(value) => setSelectedNodeVersion(parseInt(value))}
              >
                <SelectTrigger className="w-40 bg-background border-input">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {availableNodeVersions.map((nodeVer) => (
                    <SelectItem 
                      key={nodeVer} 
                      value={nodeVer.toString()}
                      className="cursor-pointer hover:bg-accent"
                    >
                      Node Version {nodeVer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="outline" className="ml-2">
                {parameterValues.length} parameters
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!parameterValues || parameterValues.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No parameters defined for this node version.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter Key</TableHead>
                  <TableHead>Data Type</TableHead>
                  <TableHead>Default Value</TableHead>
                  <TableHead>Current Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parameterValues.map((param) => (
                  <TableRow key={param.parameter_values_id}>
                    <TableCell className="font-medium">
                      {param.parameter_key}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {param.datatype}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {param.default_value || "—"}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={param.value}
                        onChange={(e) => handleParameterValueChange(param.parameter_values_id, e.target.value)}
                        placeholder="Enter value"
                        disabled={!currentVersion?.is_editable}
                        type={param.datatype === 'integer' ? 'number' : 'text'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={!currentVersion?.is_editable || saving}
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}