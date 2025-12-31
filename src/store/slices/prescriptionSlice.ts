// store/slices/prescriptionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Prescription {
  prescription_id: string;
  expiry_date: string | null;
  prescription_file: string;
  is_active: boolean;
  file_extension: string | null;
  is_expired: boolean;
  file_size: string | null;
  created_at: string;
  updated_at: string;
}

interface PrescriptionState {
  prescriptions: Prescription[];
  activePrescriptions: Prescription[];
  expiredPrescriptions: Prescription[];
  loading: boolean;
  uploading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: PrescriptionState = {
  prescriptions: [],
  activePrescriptions: [],
  expiredPrescriptions: [],
  loading: false,
  uploading: false,
  error: null,
  successMessage: null,
};

const prescriptionSlice = createSlice({
  name: 'prescription',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUploading: (state, action: PayloadAction<boolean>) => {
      state.uploading = action.payload;
    },
    
    // Error and success handling
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccessMessage: (state, action: PayloadAction<string | null>) => {
      state.successMessage = action.payload;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    
    // Prescription data
    setPrescriptions: (state, action: PayloadAction<Prescription[]>) => {
      state.prescriptions = action.payload;
    },
    setActivePrescriptions: (state, action: PayloadAction<Prescription[]>) => {
      state.activePrescriptions = action.payload;
    },
    setExpiredPrescriptions: (state, action: PayloadAction<Prescription[]>) => {
      state.expiredPrescriptions = action.payload;
    },
    
    // Add new prescription
    addPrescription: (state, action: PayloadAction<Prescription>) => {
      state.prescriptions.unshift(action.payload);
      if (action.payload.is_active && !action.payload.is_expired) {
        state.activePrescriptions.unshift(action.payload);
      }
    },
    
    // Remove prescription
    removePrescription: (state, action: PayloadAction<string>) => {
      const prescriptionId = action.payload;
      state.prescriptions = state.prescriptions.filter(p => p.prescription_id !== prescriptionId);
      state.activePrescriptions = state.activePrescriptions.filter(p => p.prescription_id !== prescriptionId);
      state.expiredPrescriptions = state.expiredPrescriptions.filter(p => p.prescription_id !== prescriptionId);
    },
    
    // Update prescription
    updatePrescription: (state, action: PayloadAction<Prescription>) => {
      const updatedPrescription = action.payload;
      const index = state.prescriptions.findIndex(p => p.prescription_id === updatedPrescription.prescription_id);
      if (index !== -1) {
        state.prescriptions[index] = updatedPrescription;
      }
      
      // Update in active/expired lists as well
      const activeIndex = state.activePrescriptions.findIndex(p => p.prescription_id === updatedPrescription.prescription_id);
      const expiredIndex = state.expiredPrescriptions.findIndex(p => p.prescription_id === updatedPrescription.prescription_id);
      
      if (updatedPrescription.is_active && !updatedPrescription.is_expired) {
        if (activeIndex === -1) {
          state.activePrescriptions.push(updatedPrescription);
        } else {
          state.activePrescriptions[activeIndex] = updatedPrescription;
        }
        // Remove from expired if it was there
        if (expiredIndex !== -1) {
          state.expiredPrescriptions.splice(expiredIndex, 1);
        }
      } else if (updatedPrescription.is_expired) {
        if (expiredIndex === -1) {
          state.expiredPrescriptions.push(updatedPrescription);
        } else {
          state.expiredPrescriptions[expiredIndex] = updatedPrescription;
        }
        // Remove from active if it was there
        if (activeIndex !== -1) {
          state.activePrescriptions.splice(activeIndex, 1);
        }
      }
    },
  },
});

export const {
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
} = prescriptionSlice.actions;

export default prescriptionSlice.reducer;