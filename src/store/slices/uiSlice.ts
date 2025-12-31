// src/store/slices/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ModalState {
  isOpen: boolean;
  type: string | null;
  data: any;
}

interface UIState {
  toast: ToastState;
  modal: ModalState;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  loading: {
    global: boolean;
    components: Record<string, boolean>;
  };
}

const initialState: UIState = {
  toast: {
    show: false,
    message: '',
    type: 'info',
  },
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
  sidebarOpen: false,
  theme: 'light',
  loading: {
    global: false,
    components: {},
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<{ message: string; type: ToastState['type'] }>) => {
      state.toast = {
        show: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    hideToast: (state) => {
      state.toast.show = false;
    },
    openModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data || null,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
      };
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setComponentLoading: (state, action: PayloadAction<{ component: string; loading: boolean }>) => {
      state.loading.components[action.payload.component] = action.payload.loading;
    },
  },
});

export const {
  showToast,
  hideToast,
  openModal,
  closeModal,
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setGlobalLoading,
  setComponentLoading,
} = uiSlice.actions;
export default uiSlice.reducer;