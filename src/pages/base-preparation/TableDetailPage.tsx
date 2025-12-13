import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Play, Database, Clock, Columns, Hash, Loader2, RefreshCw, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { CreatedTable } from "../BasePreparation";

interface CreationHistoryItem {
  id: string;
  createdDate: string;
  rowCount: number;
  columnsUsed: string[];
  timeTaken: string;
}

// Mock data for table detail
const getMockTableData = (tableName: string): CreatedTable & { creationHistory: CreationHistoryItem[] } => ({
  id: "1",
  tableName: tableName,
  createdFrom: "VLR ATTACHED CUSTOMERS",
  columnsUsed: ["MSISDN", "CUSTOMER_ID", "VLR_STATUS"],
  rowCount: 125430,
  dateCreated: "2025-12-13T10:15:32Z",
  timeTaken: "2.3s",
  parameters: { 
    table_name: tableName.replace(/_NOV29$/, ''),
    day_from: "0", 
    day_to: "10" 
  },
  tableType: "vlr_attached_customers",
  creationHistory: [
    {
      id: "h1",
      createdDate: "2025-12-13T10:15:32Z",
      rowCount: 125430,
      columnsUsed: ["MSISDN", "CUSTOMER_ID", "VLR_STATUS"],
      timeTaken: "2.3s"
    },
    {
      id: "h2",
      createdDate: "2025-12-12T09:30:00Z",
      rowCount: 118234,
      columnsUsed: ["MSISDN", "CUSTOMER_ID", "VLR_STATUS"],
      timeTaken: "2.1s"
    },
    {
      id: "h3",
      createdDate: "2025-12-11T14:45:00Z",
      rowCount: 121500,
      columnsUsed: ["MSISDN", "CUSTOMER_ID"],
      timeTaken: "1.9s"
    },
  ]
});

export default function TableDetailPage() {
  const { tableName } = useParams<{ tableName: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const decodedName = decodeURIComponent(tableName || "");
  const tableData = getMockTableData(decodedName);
  
  // Recreate form state
  const [formValues, setFormValues] = useState<Record<string, any>>(tableData.parameters);
  const [isRecreating, setIsRecreating] = useState(false);
  const [creationHistory, setCreationHistory] = useState<CreationHistoryItem[]>(tableData.creationHistory);

  const handleRecreate = async () => {
    setIsRecreating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add new entry to creation history
    const newHistoryItem: CreationHistoryItem = {
      id: `h${Date.now()}`,
      createdDate: new Date().toISOString(),
      rowCount: Math.floor(Math.random() * 50000) + 100000,
      columnsUsed: tableData.columnsUsed,
      timeTaken: `${(Math.random() * 2 + 1).toFixed(1)}s`
    };
    
    setCreationHistory([newHistoryItem, ...creationHistory]);
    
    toast({
      title: "Table Recreated",
      description: `${decodedName} has been successfully recreated.`,
    });
    
    setIsRecreating(false);
  };

  const updateFormValue = (field: string, value: any) => {
    setFormValues({ ...formValues, [field]: value });
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full py-6 px-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/base-preparation")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{decodedName}</h1>
            <p className="text-muted-foreground">Table Details</p>
          </div>
        </div>

        {/* Card 1: Table Information */}
        <Card className="border-2">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Table Information
            </CardTitle>
            <CardDescription>Metadata about this table</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Database className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Table Name</p>
                  <p className="font-medium">{tableData.tableName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Database className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Created From</p>
                  <p className="font-medium">{tableData.createdFrom}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Time Taken</p>
                  <p className="font-medium">{tableData.timeTaken}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Date Created</p>
                  <p className="font-medium">
                    {new Date(tableData.dateCreated).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Columns className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Columns Used</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tableData.columnsUsed.map((col, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {col}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Hash className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Row Count</p>
                  <p className="font-medium">{tableData.rowCount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Recreate Table */}
        <Card className="border-2">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Recreate Table
            </CardTitle>
            <CardDescription>
              Pre-filled with original parameters. Modify and recreate as needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(formValues).map(([key, value]) => (
                <div key={key}>
                  <Label className="text-sm font-semibold capitalize">
                    {key.replace(/_/g, ' ')}
                  </Label>
                  <Input
                    value={value}
                    onChange={(e) => updateFormValue(key, e.target.value)}
                    className="mt-1"
                    disabled={isRecreating}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-start">
              <Button
                onClick={handleRecreate}
                disabled={isRecreating}
                className="gap-2"
              >
                {isRecreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Recreating...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Recreate Table
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Creation History */}
        <Card className="border-2">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Creation History
                </CardTitle>
                <CardDescription>Previous creations of this table</CardDescription>
              </div>
              <Badge variant="outline">{creationHistory.length} Records</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {creationHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No previous history available
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border bg-muted/30">
                    <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created Date</TableHead>
                    <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Row Count</TableHead>
                    <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Columns Used</TableHead>
                    <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time Taken</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creationHistory.map((item, index) => (
                    <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {index === 0 && (
                            <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 text-xs">
                              Latest
                            </Badge>
                          )}
                          {new Date(item.createdDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">{item.rowCount.toLocaleString()}</TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {item.columnsUsed.map((col, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {col}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">{item.timeTaken}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
