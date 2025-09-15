import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UISliceState {
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  exportDialogOpen: boolean;
  importDialogOpen: boolean;
  showOverlayBar: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UISliceState = {
  leftPanelOpen: true,
  rightPanelOpen: true,
  exportDialogOpen: false,
  importDialogOpen: false,
  showOverlayBar: true,
  isLoading: false,
  error: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleLeftPanel: (state) => {
      state.leftPanelOpen = !state.leftPanelOpen;
    },
    toggleRightPanel: (state) => {
      state.rightPanelOpen = !state.rightPanelOpen;
    },
    setLeftPanel: (state, action: PayloadAction<boolean>) => {
      state.leftPanelOpen = action.payload;
    },
    setRightPanel: (state, action: PayloadAction<boolean>) => {
      state.rightPanelOpen = action.payload;
    },
    setExportDialog: (state, action: PayloadAction<boolean>) => {
      state.exportDialogOpen = action.payload;
    },
    setImportDialog: (state, action: PayloadAction<boolean>) => {
      state.importDialogOpen = action.payload;
    },
    setShowOverlayBar: (state, action: PayloadAction<boolean>) => {
      state.showOverlayBar = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  toggleLeftPanel,
  toggleRightPanel,
  setLeftPanel,
  setRightPanel,
  setExportDialog,
  setImportDialog,
  setShowOverlayBar,
  setLoading,
  setError,
} = uiSlice.actions;

export default uiSlice.reducer;