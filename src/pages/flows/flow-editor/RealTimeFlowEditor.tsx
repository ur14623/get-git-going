import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ArrowLeft, Save, Play, Square, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

import { flowService, useFlow, useDeployedNodes } from '@/services/flowService';
import { NodePalette } from './NodePalette';
import { PropertiesPanel } from './PropertiesPanel';
import { Loading } from '@/components/ui/loading';

// Import custom node types
import { SftpCollectorNode } from './nodes/SftpCollectorNode';
import { FdcNode } from './nodes/FdcNode';
import { Asn1DecoderNode } from './nodes/Asn1DecoderNode';
import { AsciiDecoderNode } from './nodes/AsciiDecoderNode';
import { ValidationBlnNode } from './nodes/ValidationBlnNode';
import { EnrichmentBlnNode } from './nodes/EnrichmentBlnNode';
import { EncoderNode } from './nodes/EncoderNode';
import { DiameterInterfaceNode } from './nodes/DiameterInterfaceNode';
import { RawBackupNode } from './nodes/RawBackupNode';

const nodeTypes = {
  sftp_collector: SftpCollectorNode,
  fdc: FdcNode,
  asn1_decoder: Asn1DecoderNode,
  ascii_decoder: AsciiDecoderNode,
  validation_bln: ValidationBlnNode,
  enrichment_bln: EnrichmentBlnNode,
  encoder: EncoderNode,
  diameter_interface: DiameterInterfaceNode,
  raw_backup: RawBackupNode,
};

export function RealTimeFlowEditor() {
  const navigate = useNavigate();
  const { id: flowId } = useParams();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [flowNodeMap, setFlowNodeMap] = useState<Map<string, string>>(new Map());
  const [validationStatus, setValidationStatus] = useState<'valid' | 'invalid' | 'checking' | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Fetch flow data and deployed nodes
  const { data: flowData, loading: flowLoading, error: flowError, refetch: refetchFlow } = useFlow(flowId || '');
  const { data: deployedNodes, loading: nodesLoading } = useDeployedNodes();

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Helper function to determine node type based on name
  const determineNodeType = (nodeName: string): string => {
    const name = nodeName.toLowerCase();
    if (name.includes('sftp') || name.includes('collector')) return 'sftp_collector';
    if (name.includes('fdc')) return 'fdc';
    if (name.includes('asn1') || name.includes('decoder')) return 'asn1_decoder';
    if (name.includes('ascii')) return 'ascii_decoder';
    if (name.includes('validation')) return 'validation_bln';
    if (name.includes('enrichment')) return 'enrichment_bln';
    if (name.includes('encoder')) return 'encoder';
    if (name.includes('diameter')) return 'diameter_interface';
    if (name.includes('backup')) return 'raw_backup';
    return 'sftp_collector'; // default fallback
  };

  // 2. ADD NODES - Drag from palette with real-time API
  const handleAddNode = async (nodeId: string, position?: { x: number; y: number }) => {
    if (!flowId) {
      toast.error('No flow ID available');
      return;
    }

    try {
      console.log('🚀 Adding node to flow:', { nodeId, flowId, position });
      
      // Find the deployed node data
      const deployedNode = deployedNodes.find(n => n.id === nodeId);
      if (!deployedNode) {
        toast.error('Node not found');
        return;
      }

      // Create FlowNode via API (real-time)
      const flowNode = await flowService.createFlowNode({
        node_family_id: nodeId,
        flow_id: flowId,
        from_node_id: null
      });

      console.log('✅ FlowNode created via API:', flowNode);

      // Create visual node for canvas
      const canvasNodeId = flowNode.id; // Use flowNode ID as canvas node ID
      const nodeType = determineNodeType(deployedNode.name);
      const selectedSubnode = deployedNode.subnodes.find(s => s.is_selected);

      const newNode: Node = {
        id: canvasNodeId,
        type: nodeType,
        position: position || { x: Math.random() * 300 + 200, y: Math.random() * 200 + 150 },
        data: {
          label: deployedNode.name,
          description: `${deployedNode.name} node`,
          nodeId: nodeId,
          flowNodeId: flowNode.id,
          subnodes: deployedNode.subnodes,
          selectedSubnode: selectedSubnode,
          parameters: selectedSubnode?.parameters || [],
        },
      };

      // Map for future API calls
      setFlowNodeMap(prev => new Map(prev.set(canvasNodeId, flowNode.id)));
      
      // Add to canvas immediately
      setNodes((nds) => [...nds, newNode]);
      
      toast.success(`${deployedNode.name} added to flow`);
      
    } catch (error) {
      console.error('❌ Error adding node:', error);
      toast.error('Failed to add node to flow');
    }
  };

  // Handle drag and drop
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      
      const nodeId = event.dataTransfer.getData('application/reactflow');
      if (!nodeId) return;

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 50,
      };

      handleAddNode(nodeId, position);
    },
    [handleAddNode],
  );

  // 3. CONNECT NODES - Draw connection with real-time API
  const onConnect = useCallback(
    async (params: Connection) => {
      console.log('🔗 Connecting nodes:', params);
      
      if (!flowId || !params.source || !params.target) return;

      // Optimistic update
      setEdges((eds) => addEdge(params, eds));
      
      try {
        // 1. Create the edge connection
        await flowService.createFlowEdge({
          flow: flowId,
          from_node: params.source,
          to_node: params.target,
          condition: ''
        });
        
        // 2. Update the target node's from_node_id field
        await flowService.updateFlowNodeConnection(params.target, params.source);
        
        console.log('✅ Connection created successfully via API');
        toast.success('Nodes connected successfully');
        
      } catch (error) {
        console.error('❌ Error creating connection:', error);
        toast.error('Failed to create connection');
        
        // Revert optimistic update
        setEdges((eds) => eds.filter(edge => 
          !(edge.source === params.source && edge.target === params.target)
        ));
      }
    },
    [setEdges, flowId],
  );

  // Handle edge deletion
  const onEdgesDelete = useCallback(
    async (edgesToDelete: Edge[]) => {
      console.log('🗑️ Deleting edges:', edgesToDelete);
      
      // Optimistic update
      setEdges((eds) => eds.filter(edge => 
        !edgesToDelete.some(delEdge => delEdge.id === edge.id)
      ));
      
      if (flowId) {
        try {
          for (const edge of edgesToDelete) {
            await flowService.deleteFlowEdge(edge.id);
            if (edge.target) {
              await flowService.updateFlowNodeConnection(edge.target, null);
            }
          }
          
          console.log('✅ Edges deleted successfully via API');
          toast.success('Connections removed successfully');
          
        } catch (error) {
          console.error('❌ Error deleting edges:', error);
          toast.error('Failed to remove connections');
          
          // Revert optimistic update
          setEdges((eds) => [...eds, ...edgesToDelete]);
        }
      }
    },
    [setEdges, flowId],
  );

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('👆 Node selected:', node);
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle node updates (for properties panel)
  const handleUpdateNode = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    );
  }, [setNodes]);

  // Handle node deletion
  const handleDeleteNode = useCallback(
    async (nodeId: string) => {
      try {
        // Delete from API first
        await flowService.deleteFlowNode(nodeId);
        
        // Remove from canvas
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
        
        // Clear selection
        if (selectedNode?.id === nodeId) {
          setSelectedNode(null);
        }
        
        // Remove from mapping
        setFlowNodeMap(prev => {
          const newMap = new Map(prev);
          newMap.delete(nodeId);
          return newMap;
        });
        
        toast.success('Node deleted successfully');
        
      } catch (error) {
        console.error('❌ Error deleting node:', error);
        toast.error('Failed to delete node');
      }
    },
    [setNodes, setEdges, selectedNode],
  );

  // 5. REORDER NODES - Handle node position changes with API
  const handleNodesChange = useCallback(
    async (changes: any[]) => {
      onNodesChange(changes);
      
      // Find position changes and update via API
      const positionChanges = changes.filter(change => change.type === 'position' && change.position);
      
      if (positionChanges.length > 0 && flowId) {
        for (const change of positionChanges) {
          try {
            // Update node order/position via API (mock - adjust based on actual API)
            console.log('📍 Updating node position:', change);
            // Note: This would need the actual API endpoint for updating node positions
            // await flowService.updateFlowNodePosition(change.id, change.position);
          } catch (error) {
            console.warn('⚠️ Failed to update node position via API:', error);
          }
        }
      }
    },
    [onNodesChange, flowId],
  );

  // 6. VALIDATE & SAVE - Flow validation
  const handleValidateFlow = async () => {
    if (!flowId) return;
    
    setValidationStatus('checking');
    
    try {
      const result = await flowService.validateFlow(flowId);
      
      if (result.valid) {
        setValidationStatus('valid');
        setValidationErrors([]);
        toast.success('Flow validation passed!');
      } else {
        setValidationStatus('invalid');
        setValidationErrors(result.errors || ['Flow validation failed']);
        toast.error(`Flow validation failed: ${result.errors?.join(', ')}`);
      }
    } catch (error) {
      console.error('❌ Flow validation error:', error);
      setValidationStatus('invalid');
      setValidationErrors(['Validation request failed']);
      toast.error('Failed to validate flow');
    }
  };

  // Handle save and redirect
  const handleSaveFlow = async () => {
    if (!flowId) return;
    
    await handleValidateFlow();
    
    // If validation passes, redirect to flows list
    if (validationStatus === 'valid') {
      navigate('/flows');
    }
  };

  if (flowLoading || nodesLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading text="Loading flow editor..." />
      </div>
    );
  }

  if (flowError) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading flow: {flowError}</p>
          <Button onClick={() => navigate('/flows')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Flows
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/flows')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Flows
          </Button>
          
          <div>
            <h1 className="text-xl font-semibold">{flowData?.name || 'Flow Editor'}</h1>
            <p className="text-sm text-muted-foreground">{flowData?.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Validation Status */}
          {validationStatus && (
            <Badge 
              variant={validationStatus === 'valid' ? 'default' : validationStatus === 'invalid' ? 'destructive' : 'secondary'}
              className="flex items-center gap-1"
            >
              {validationStatus === 'checking' && <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              {validationStatus === 'valid' && <CheckCircle className="w-3 h-3" />}
              {validationStatus === 'invalid' && <AlertTriangle className="w-3 h-3" />}
              {validationStatus === 'checking' ? 'Validating...' : 
               validationStatus === 'valid' ? 'Valid' : 'Invalid'}
            </Badge>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleValidateFlow}
            disabled={validationStatus === 'checking'}
          >
            Validate
          </Button>
          
          <Button
            size="sm"
            onClick={handleSaveFlow}
            disabled={validationStatus === 'checking'}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Flow
          </Button>
        </div>
      </div>

      {/* Validation Errors */}
      {validationStatus === 'invalid' && validationErrors.length > 0 && (
        <div className="bg-destructive/10 border-b border-destructive/20 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Validation Errors:</p>
              <ul className="text-sm text-destructive/80 mt-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Node Palette */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full p-4">
              <NodePalette onAddNode={handleAddNode} />
            </div>
          </ResizablePanel>
          
          <ResizableHandle className="w-1 bg-border hover:bg-border-hover transition-colors" />
          
          {/* Canvas */}
          <ResizablePanel defaultSize={selectedNode ? 55 : 80} minSize={40}>
            <div 
              className="h-full w-full"
              onDragOver={onDragOver}
              onDrop={onDrop}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                onEdgesDelete={onEdgesDelete}
                nodeTypes={nodeTypes}
                className="bg-background"
                fitView
                fitViewOptions={{ padding: 0.2 }}
              >
                <Controls className="bg-card border-border" />
                <MiniMap 
                  className="bg-card border-border" 
                  nodeColor="#8b5cf6"
                  maskColor="rgba(0, 0, 0, 0.1)"
                />
                <Background 
                  variant={BackgroundVariant.Dots} 
                  gap={20} 
                  size={1} 
                  className="opacity-30" 
                />
              </ReactFlow>
            </div>
          </ResizablePanel>
          
          {/* Properties Panel */}
          {selectedNode && (
            <>
              <ResizableHandle className="w-1 bg-border hover:bg-border-hover transition-colors" />
              <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
                <PropertiesPanel 
                  selectedNode={selectedNode}
                  onUpdateNode={handleUpdateNode}
                  onDeleteNode={handleDeleteNode}
                  flowId={flowId}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}