import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Trash2, Database, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CreatedTable } from "../BasePreparation";

export default function SavedTablesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedTables, setSavedTables] = useState<CreatedTable[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved tables from localStorage
    const loadSavedTables = () => {
      const tables = JSON.parse(localStorage.getItem('savedTables') || '[]');
      setSavedTables(tables);
      setIsLoading(false);
    };
    loadSavedTables();
  }, []);

  const handleViewTable = (tableName: string) => {
    navigate(`/base-preparation/table/${encodeURIComponent(tableName)}`);
  };

  const handleDeleteTable = async (tableId: string, tableName: string) => {
    setDeletingId(tableId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedTables = savedTables.filter(t => t.id !== tableId);
    setSavedTables(updatedTables);
    localStorage.setItem('savedTables', JSON.stringify(updatedTables));
    
    toast({
      title: "Table Removed",
      description: `${tableName} has been removed from saved tables.`,
    });
    
    setDeletingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 w-full">
      <div className="w-full p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Saved Tables
          </h1>
          <p className="text-muted-foreground mt-1">View and manage your saved base-preparation tables</p>
        </div>

        <Card className="border-2 shadow-elegant">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Saved Tables
                </CardTitle>
                <CardDescription>Tables saved for quick access</CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                {savedTables.length} Tables
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border bg-muted/30">
                    <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Table Name</TableHead>
                    <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created From</TableHead>
                    <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date Created</TableHead>
                    <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Columns Used</TableHead>
                    <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Row Count</TableHead>
                    <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedTables.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <Database className="h-12 w-12 text-muted-foreground/50" />
                          <p>No saved tables yet</p>
                          <p className="text-sm">Save tables from the Base Preparation page to see them here.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    savedTables.map((table) => (
                      <TableRow key={table.id} className="hover:bg-muted/20 transition-colors">
                        <TableCell className="px-6 py-4 font-medium">{table.tableName}</TableCell>
                        <TableCell className="px-6 py-4">{table.createdFrom}</TableCell>
                        <TableCell className="px-6 py-4">
                          {new Date(table.dateCreated).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {table.columnsUsed.map((col, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {col}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">{table.rowCount.toLocaleString()}</TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewTable(table.tableName)}
                              className="gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTable(table.id, table.tableName)}
                              disabled={deletingId === table.id}
                              className="gap-1 text-destructive hover:text-destructive"
                            >
                              {deletingId === table.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              Remove
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
