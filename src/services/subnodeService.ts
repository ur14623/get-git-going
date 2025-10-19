import { useState, useEffect } from 'react';
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaces based on API response
export interface SubnodeListItem {
  id: string;
  name: string;
  description: string;
  node_family?: string;
  node_family_name: string;
  active_version: number | null;
  latest_version: number;
  status: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface SubnodesListResponse {
  total_subnodes_number: number;
  total_active_subnodes_number: number;
  total_drafted_subnodes_number: number;
  subnodes: SubnodeListItem[];
}

export interface ParameterValue {
  id: string;
  parameter_key: string;
  value: string;
}

export interface SubnodeVersion {
  id: string;
  version: number;
  is_deployed: boolean;
  is_editable: boolean;
  updated_at: string;
  updated_by: string;
  version_comment: string | null;
  parameter_values: ParameterValue[];
}

export interface SubnodeParameterValuesByVersion {
  node_version: number;
  parameter_values: Array<{
    parameter_key: string;
    value: string;
    default_value: string;
    datatype: string;
    source: string;
  }>;
}

export interface SubnodeVersionWithParametersByNodeVersion extends SubnodeVersion {
  parameter_values_by_nodeversion?: SubnodeParameterValuesByVersion[];
}

export interface SubnodeDetail {
  id: string;
  name: string;
  description: string;
  node?: string;
  node_family: {
    id: string;
    name: string;
  };
  active_version: number | null;
  published: boolean;
  published_version?: SubnodeVersionWithParametersByNodeVersion;
  last_version?: SubnodeVersionWithParametersByNodeVersion;
  original_version: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  versions: SubnodeVersionWithParametersByNodeVersion[];
}

export interface CreateSubnodeResponse {
  name: string;
  description: string;
  node_family: string;
  id?: string; // Sometimes included in response
}

export interface CreateSubnodeRequest {
  name: string;
  description: string;
  node_family: string;
}

export interface ParameterValueRequest {
  id: string;
  value: string;
}

export interface EditWithParametersRequest {
  name?: string;
  description?: string;
  parameter_values?: ParameterValueRequest[];
}

export interface CloneSubnodeRequest {
  name?: string;
  [key: string]: any;
}

export interface CreateEditableVersionRequest {
  version_comment: string;
}

export interface VersionDetail {
  id: string;
  name: string;
  description: string;
  node: string;
  version: number;
  version_comment: string;
  is_deployed: boolean;
  is_editable: boolean;
  parameter_values: ParameterValue[];
}

// API Service Functions
export const subnodeService = {
  // List all subnodes
  async getAllSubnodes(): Promise<SubnodesListResponse> {
    const response = await axiosInstance.get('subnodes/');
    return response.data;
  },

  // Get single subnode detail
  async getSubnode(id: string): Promise<SubnodeDetail> {
    const response = await axiosInstance.get(`subnodes/${id}/`);
    return response.data;
  },

  // Update subnode (PATCH)
  async updateSubnode(id: string, data: Partial<SubnodeDetail>): Promise<SubnodeDetail> {
    const response = await axiosInstance.patch(`subnodes/${id}/`, data);
    return response.data;
  },

  // Delete subnode (all versions)
  async deleteSubnode(id: string): Promise<{ detail: string }> {
    const response = await axiosInstance.delete(`subnodes/${id}/`);
    return response.data;
  },

  // Create new subnode
  async createSubnode(data: CreateSubnodeRequest): Promise<CreateSubnodeResponse> {
    const response = await axiosInstance.post('subnodes/', data);
    return response.data;
  },

  // Update parameter values
  async updateParameterValues(id: string, parameterValues: ParameterValueRequest[]): Promise<any> {
    const response = await axiosInstance.patch(`subnodes/${id}/update_parameter_values/`, {
      parameter_values: parameterValues
    });
    return response.data;
  },

  // Edit subnode with parameters
  async editWithParameters(id: string, data: EditWithParametersRequest): Promise<any> {
    const response = await axiosInstance.patch(`subnodes/${id}/edit_with_parameters/`, data);
    return response.data;
  },

  // Create editable version from active
  async createEditableVersion(id: string, data: CreateEditableVersionRequest): Promise<SubnodeDetail> {
    const response = await axiosInstance.post(`subnodes/${id}/create_editable_version/`, data);
    return response.data;
  },

  // Deploy specific version (Set as ACTIVE)
  async deployVersion(id: string, version: number): Promise<{ id: string; is_deployed: boolean; message: string }> {
    const response = await axiosInstance.post(`subnodes/${id}/deploy/${version}`);
    return response.data;
  },

  // Undeploy (Set ACTIVE version to inactive)
  async undeployVersion(id: string): Promise<{ id: string; is_deployed: boolean; message: string }> {
    const response = await axiosInstance.post(`subnodes/${id}/undeploy/`);
    return response.data;
  },

  // Get all deployed subnodes (ACTIVE versions)
  async getDeployedSubnodes(): Promise<SubnodeVersion[]> {
    const response = await axiosInstance.get('subnodes/deployed/');
    return response.data;
  },

  // Get all versions for a subnode (shallow)
  async getVersions(id: string): Promise<SubnodeVersion[]> {
    const response = await axiosInstance.get(`subnodes/${id}/versions/`);
    return response.data;
  },

  // Get specific version detail
  async getVersionDetail(id: string, version: number): Promise<VersionDetail> {
    const response = await axiosInstance.get(`subnodes/${id}/versions/${version}`);
    return response.data;
  },

  // Export subnode
  async exportSubnode(id: string): Promise<any> {
    const response = await axiosInstance.get(`subnodes/${id}/export/`);
    return response.data;
  },

  // Import subnode
  async importSubnode(file: File): Promise<SubnodeDetail> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('subnodes/import/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Clone subnode
  async cloneSubnode(id: string, data?: CloneSubnodeRequest): Promise<SubnodeDetail> {
    const response = await axiosInstance.post(`subnodes/${id}/clone/`, data || {});
    return response.data;
  },

  // Delete specific version (by version_id)
  async deleteSubnodeVersion(versionId: string): Promise<void> {
    await axiosInstance.delete(`subnodes/versions/${versionId}`);
  },

  // Get all parameter overrides
  async getAllParameterValues(): Promise<any[]> {
    const response = await axiosInstance.get('subnode-parameter-values/');
    return response.data;
  },

  // Batch update parameters on a DRAFT version
  async batchUpdateParameters(data: { subnode_version: string; parameter_values: Array<{ parameter: string; value: string }> }): Promise<any> {
    const response = await axiosInstance.post('subnode-parameter-values/batch_update/', data);
    return response.data;
  },
};

// Custom hook for fetching all subnodes
export const useSubnodes = () => {
  const [data, setData] = useState<SubnodesListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSubnodes = async () => {
      try {
        const subnodes = await subnodeService.getAllSubnodes();
        setData(subnodes);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Error fetching subnodes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSubnodes();
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      const subnodes = await subnodeService.getAllSubnodes();
      setData(subnodes);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error fetching subnodes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Custom hook for fetching single subnode
export const useSubnode = (id: string) => {
  const [data, setData] = useState<SubnodeDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadSubnode = async () => {
      try {
        setLoading(true);
        const subnode = await subnodeService.getSubnode(id);
        setData(subnode);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Error fetching subnode');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSubnode();
  }, [id]);

  const refetch = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const subnode = await subnodeService.getSubnode(id);
      setData(subnode);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error fetching subnode');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Custom hook that returns versions from subnode data
export const useSubnodeVersions = (subnodeData: SubnodeDetail | null) => {
  const data = subnodeData?.versions || [];
  const loading = false;
  const error = null;

  const refetch = () => {
    // Versions are part of subnode data, so refetch is handled by parent
  };

  return { data, loading, error, refetch };
};