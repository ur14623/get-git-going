import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Play, Square, RefreshCw } from 'lucide-react';
import { nodeService, NodeVersionDetail } from '@/services/nodeService';

interface ExecutionStatus {
  executionId?: string;
  isRunning: boolean;
  startTime?: string;
  status?: string;
}

interface SubnodeOption {
  id: string;
  name: string;
}

export function TestNodePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [node, setNode] = useState<NodeVersionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subnodes, setSubnodes] = useState<SubnodeOption[]>([]);
  const [selectedSubnodeId, setSelectedSubnodeId] = useState<string>('');
  const [rawLogs, setRawLogs] = useState<string>('');
  const [executionStatus, setExecutionStatus] = useState<ExecutionStatus>({ isRunning: false });
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logPollingRef = useRef<NodeJS.Timeout | null>(null);

  // Get version from URL params, default to 1 if not provided
  const version = parseInt(searchParams.get('version') || '1');

  useEffect(() => {
    const fetchNodeAndSubnodes = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // Fetch node version details
        const nodeData = await nodeService.getNodeVersionDetail(id, version);
        setNode(nodeData);
        
        // Fetch subnodes for this version
        const subnodesData = await nodeService.getNodeVersionSubnodes(id, nodeData.id);
        setSubnodes(subnodesData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch node details');
      } finally {
        setLoading(false);
      }
    };
    fetchNodeAndSubnodes();
  }, [id, version]);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [rawLogs]);

  // Poll for execution logs
  const pollLogs = async (executionId: string) => {
    try {
      const logsResponse = await nodeService.getExecutionLogs(executionId);
      setRawLogs(logsResponse.log);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  const startLogPolling = (executionId: string) => {
    if (logPollingRef.current) {
      clearInterval(logPollingRef.current);
    }
    
    logPollingRef.current = setInterval(() => {
      pollLogs(executionId);
    }, 1000); // Poll every second
  };

  const stopLogPolling = () => {
    if (logPollingRef.current) {
      clearInterval(logPollingRef.current);
      logPollingRef.current = null;
    }
  };

  const handleStartExecution = async () => {
    if (!selectedSubnodeId || !node) {
      toast({
        title: "Selection Required",
        description: "Please select a subnode to execute",
        variant: "destructive"
      });
      return;
    }

    try {
      setExecutionStatus({ isRunning: true, startTime: new Date().toISOString() });
      setRawLogs('');
      
      // Execute the node
      const executionResponse = await nodeService.executeNode(id!, node.id, selectedSubnodeId);
      
      setExecutionStatus(prev => ({
        ...prev,
        executionId: executionResponse.id,
        status: executionResponse.status
      }));

      // Start polling for logs
      startLogPolling(executionResponse.id);

      toast({
        title: "Execution Started",
        description: `Node execution started with ID: ${executionResponse.id}`,
      });

    } catch (error: any) {
      setExecutionStatus({ isRunning: false });
      toast({
        title: "Execution Failed",
        description: error.message || "Failed to start node execution",
        variant: "destructive"
      });
    }
  };

  const handleStopExecution = async () => {
    if (!executionStatus.executionId) return;

    try {
      await nodeService.stopNodeExecution(executionStatus.executionId);
      setExecutionStatus(prev => ({ ...prev, isRunning: false, status: 'stopped' }));
      stopLogPolling();
      
      toast({
        title: "Execution Stopped",
        description: "Node execution has been stopped",
      });
    } catch (error: any) {
      toast({
        title: "Stop Failed",
        description: error.message || "Failed to stop node execution",
        variant: "destructive"
      });
    }
  };

  const clearLogs = () => {
    setRawLogs('');
  };

  // Cleanup polling on component unmount
  useEffect(() => {
    return () => {
      stopLogPolling();
    };
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !node) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">
              {error || 'Node version not found'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Test Node</h1>
          <p className="text-muted-foreground">Execute and monitor node performance</p>
        </div>
      </div>

      {/* Node Details */}
      <Card>
        <CardHeader>
          <CardTitle>Node Information</CardTitle>
          <CardDescription>Details about the selected node version</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Family Name</label>
              <p className="text-base">{node.family_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Version</label>
              <p className="text-base">v{node.version}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">State</label>
              <Badge variant={node.state === 'deployed' ? 'default' : 'secondary'}>
                {node.state}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Changelog</label>
              <p className="text-base">{node.changelog || 'No changelog available'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Parameters</label>
              <p className="text-base">{node.parameters?.length || 0} parameters</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Subnodes</label>
              <p className="text-base">{node.subnodes?.length || 0} subnodes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Execution Control */}
      <Card>
        <CardHeader>
          <CardTitle>Execution Control</CardTitle>
          <CardDescription>Select a subnode and start execution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Select Subnode
              </label>
              <Select value={selectedSubnodeId} onValueChange={setSelectedSubnodeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a subnode to execute" />
                </SelectTrigger>
                <SelectContent>
                  {subnodes.length ? (
                    subnodes.map((subnode) => (
                      <SelectItem key={subnode.id} value={subnode.id}>
                        {subnode.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-subnodes" disabled>
                      No subnodes available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              {executionStatus.isRunning ? (
                <Button onClick={handleStopExecution} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              ) : (
                <Button 
                  onClick={handleStartExecution} 
                  disabled={!selectedSubnodeId || selectedSubnodeId === 'no-subnodes'}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Execution
                </Button>
              )}
            </div>
          </div>

          {executionStatus.executionId && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Execution ID: {executionStatus.executionId}</span>
              <span>Status: {executionStatus.status || (executionStatus.isRunning ? 'Running' : 'Completed')}</span>
              {executionStatus.startTime && (
                <span>Started: {new Date(executionStatus.startTime).toLocaleTimeString()}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Execution Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Execution Logs</CardTitle>
              <CardDescription>Real-time execution monitoring and debugging information</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={clearLogs}>
              Clear Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full border rounded-md p-4">
            {!rawLogs ? (
              <p className="text-muted-foreground text-center py-8">
                No logs yet. Start execution to see logs appear here.
              </p>
            ) : (
              <div className="space-y-1">
                <pre className="text-xs font-mono whitespace-pre-wrap text-foreground">
                  {rawLogs}
                </pre>
                <div ref={logsEndRef} />
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}