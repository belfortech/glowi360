// hooks/usePrescriptionApi.ts
import { useAppDispatch, useAppSelector } from '../store';
import {
  setLoading,
  setUploading,
  setError,
  setSuccessMessage,
  clearMessages,
  setPrescriptions,
  setActivePrescriptions,
  setExpiredPrescriptions,
  addPrescription,
  removePrescription,
  updatePrescription,
  Prescription,
} from '../store/slices/prescriptionSlice';
import { API_BASE_URL } from '../config/api';

interface UploadPrescriptionData {
  prescription_file: File;
  expiry_date?: string;
}

export const usePrescriptionApi = () => {
  const dispatch = useAppDispatch();
  const { prescriptions, activePrescriptions, expiredPrescriptions, loading, uploading, error, successMessage } = useAppSelector(
    (state) => state.prescription
  );

  const getAuthToken = () => {
    return localStorage.getItem('access_token');
  };

  // Fetch all prescriptions
  const fetchPrescriptions = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(clearMessages());
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}prescriptions/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prescriptions');
      }

      const data: Prescription[] = await response.json();
      dispatch(setPrescriptions(data));
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch prescriptions';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Fetch active prescriptions
  const fetchActivePrescriptions = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(clearMessages());
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}prescriptions/active/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch active prescriptions');
      }

      const data: Prescription[] = await response.json();
      dispatch(setActivePrescriptions(data));
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch active prescriptions';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Fetch expired prescriptions
  const fetchExpiredPrescriptions = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(clearMessages());
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}prescriptions/expired/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch expired prescriptions');
      }

      const data: Prescription[] = await response.json();
      dispatch(setExpiredPrescriptions(data));
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch expired prescriptions';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Upload new prescription
  const uploadPrescription = async (prescriptionData: UploadPrescriptionData) => {
    try {
      dispatch(setUploading(true));
      dispatch(clearMessages());
      const token = getAuthToken();

      const formData = new FormData();
      formData.append('prescription_file', prescriptionData.prescription_file);
      if (prescriptionData.expiry_date) {
        formData.append('expiry_date', prescriptionData.expiry_date);
      }

      const response = await fetch(`${API_BASE_URL}prescriptions/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload prescription');
      }

      const newPrescription: Prescription = await response.json();
      dispatch(addPrescription(newPrescription));
      dispatch(setSuccessMessage('Prescription uploaded successfully!'));
      return newPrescription;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload prescription';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setUploading(false));
    }
  };

  // Delete prescription
  const deletePrescription = async (prescriptionId: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearMessages());
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}prescriptions/${prescriptionId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete prescription');
      }

      dispatch(removePrescription(prescriptionId));
      dispatch(setSuccessMessage('Prescription deleted successfully!'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete prescription';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Download prescription
  const downloadPrescription = async (prescriptionId: string) => {
    try {
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}prescriptions/${prescriptionId}/download/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download prescription');
      }

      // Get filename from response headers
      const contentDisposition = response.headers.get('Content-Disposition');
      const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `prescription_${prescriptionId}`;

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      dispatch(setSuccessMessage('Prescription downloaded successfully!'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to download prescription';
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  // Clear messages
  const clearPrescriptionMessages = () => {
    dispatch(clearMessages());
  };

  return {
    // State
    prescriptions,
    activePrescriptions,
    expiredPrescriptions,
    loading,
    uploading,
    error,
    successMessage,

    // Actions
    fetchPrescriptions,
    fetchActivePrescriptions,
    fetchExpiredPrescriptions,
    uploadPrescription,
    deletePrescription,
    downloadPrescription,
    clearPrescriptionMessages,
  };
};
