import { useState, useCallback } from 'react';
import { Node, Edge, Connection, addEdge } from '@xyflow/react';
import { flowService } from '@/services/flowService';
import { toast } from 'sonner';

/**
 * Custom hook for real-time flow operations
 * Handles all the immediate API calls for flow editing
 */
export function useFlowRealTime(flowId: string) {
  const [validationStatus, setValidationStatus] = useState<'valid' | 'invalid' | 'checking' | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Real-time node addition with API call
  const addNodeRealTime = useCallback(async (
    nodeId: string, 
    deployedNodes: any[], 
    position?: { x: number; y: number }
  ) => {
    try {
      console.log('🚀 Adding node to flow (real-time):', { nodeId, flowId, position });
      
      // Find the deployed node data
      const deployedNode = deployedNodes.find(n => n.id === nodeId);
      if (!deployedNode) {
        throw new Error('Node not found');
      }

      // Create FlowNode via API (real-time)
      const flowNode = await flowService.createFlowNode({
        node_family_id: nodeId,
        flow_id: flowId,
        from_node_id: null
      });

      console.log('✅ FlowNode created via API:', flowNode);

      // Return node data for canvas
      return {
        flowNode,
        deployedNode,
        canvasNodeId: flowNode.id,
        position: position || { x: Math.random() * 300 + 200, y: Math.random() * 200 + 150 }
      };
      
    } catch (error) {
      console.error('❌ Error adding node:', error);
      toast.error('Failed to add node to flow');
      throw error;
    }
  }, [flowId]);

  // Real-time connection creation with API calls
  const connectNodesRealTime = useCallback(async (params: Connection, setEdges: any) => {
    console.log('🔗 Connecting nodes (real-time):', params);
    
    if (!params.source || !params.target) return false;

    // Optimistic update
    setEdges((eds: Edge[]) => addEdge(params, eds));
    
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
      return true;
      
    } catch (error) {
      console.error('❌ Error creating connection:', error);
      toast.error('Failed to create connection');
      
      // Revert optimistic update
      setEdges((eds: Edge[]) => eds.filter(edge => 
        !(edge.source === params.source && edge.target === params.target)
      ));
      return false;
    }
  }, [flowId]);

  // Real-time edge deletion with API calls
  const deleteEdgesRealTime = useCallback(async (edgesToDelete: Edge[], setEdges: any) => {
    console.log('🗑️ Deleting edges (real-time):', edgesToDelete);
    
    // Optimistic update
    setEdges((eds: Edge[]) => eds.filter(edge => 
      !edgesToDelete.some(delEdge => delEdge.id === edge.id)
    ));
    
    try {
      for (const edge of edgesToDelete) {
        await flowService.deleteFlowEdge(edge.id);
        if (edge.target) {
          await flowService.updateFlowNodeConnection(edge.target, null);
        }
      }
      
      console.log('✅ Edges deleted successfully via API');
      toast.success('Connections removed successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error deleting edges:', error);
      toast.error('Failed to remove connections');
      
      // Revert optimistic update
      setEdges((eds: Edge[]) => [...eds, ...edgesToDelete]);
      return false;
    }
  }, [flowId]);

  // Real-time node deletion with API call
  const deleteNodeRealTime = useCallback(async (nodeId: string, setNodes: any, setEdges: any, selectedNode: Node | null, setSelectedNode: any) => {
    try {
      // Delete from API first
      await flowService.deleteFlowNode(nodeId);
      
      // Remove from canvas
      setNodes((nds: Node[]) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds: Edge[]) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
      
      // Clear selection if deleted node was selected  
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
      }
      
      console.log('✅ Node deleted successfully via API');
      toast.success('Node deleted successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error deleting node:', error);
      toast.error('Failed to delete node');
      return false;
    }
  }, []);

  // Real-time subnode selection with parameter updates
  const selectSubnodeRealTime = useCallback(async (flowNodeId: string, subnodeId: string) => {
    try {
      await flowService.updateFlowNodeSubnode(flowNodeId, subnodeId);
      console.log('✅ Subnode selection updated successfully via API');
      return true;
    } catch (error) {
      console.error('❌ Error updating subnode selection:', error);
      return false;
    }
  }, []);

  // Real-time flow validation
  const validateFlowRealTime = useCallback(async () => {
    setValidationStatus('checking');
    
    try {
      const result = await flowService.validateFlow(flowId);
      
      if (result.valid) {
        setValidationStatus('valid');
        setValidationErrors([]);
        toast.success('Flow validation passed!');
        return true;
      } else {
        setValidationStatus('invalid');
        setValidationErrors(result.errors || ['Flow validation failed']);
        toast.error(`Flow validation failed: ${result.errors?.join(', ')}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Flow validation error:', error);
      setValidationStatus('invalid');
      setValidationErrors(['Validation request failed']);
      toast.error('Failed to validate flow');
      return false;
    }
  }, [flowId]);

  return {
    // Actions
    addNodeRealTime,
    connectNodesRealTime,
    deleteEdgesRealTime,
    deleteNodeRealTime,
    selectSubnodeRealTime,
    validateFlowRealTime,
    
    // State
    validationStatus,
    validationErrors,
    setValidationStatus,
    setValidationErrors
  };
}