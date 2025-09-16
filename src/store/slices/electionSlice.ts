import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Candidate, RegionResult, ElectionState } from '../../types/election';

interface ElectionSliceState extends ElectionState {
  selectedCandidateId: string | null;
  isLiveMode: boolean;
}

const initialState: ElectionSliceState = {
  candidates: [],
  results: [],
  totalVotes: 0,
  lastUpdated: new Date(),
  selectedCandidateId: null,
  isLiveMode: false,
};

const electionSlice = createSlice({
  name: 'election',
  initialState,
  reducers: {
    setCandidates: (state, action: PayloadAction<Candidate[]>) => {
      state.candidates = action.payload;
    },
    addCandidate: (state, action: PayloadAction<Candidate>) => {
      state.candidates.push(action.payload);
    },
    updateCandidate: (state, action: PayloadAction<Candidate>) => {
      const index = state.candidates.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index] = action.payload;
      }
    },
    removeCandidate: (state, action: PayloadAction<string>) => {
      state.candidates = state.candidates.filter(c => c.id !== action.payload);
    },
    setResults: (state, action: PayloadAction<RegionResult[]>) => {
      state.results = action.payload;
      state.totalVotes = action.payload.reduce((sum, result) => sum + result.votes, 0);
    },
    updateRegionResult: (state, action: PayloadAction<RegionResult>) => {
      const index = state.results.findIndex(r => r.regionId === action.payload.regionId);
      if (index !== -1) {
        const oldVotes = state.results[index].votes;
        state.results[index] = action.payload;
        state.totalVotes = state.totalVotes - oldVotes + action.payload.votes;
      } else {
        state.results.push(action.payload);
        state.totalVotes += action.payload.votes;
      }
    },
    setSelectedCandidate: (state, action: PayloadAction<string | null>) => {
      state.selectedCandidateId = action.payload;
    },
    setLiveMode: (state, action: PayloadAction<boolean>) => {
      state.isLiveMode = action.payload;
    },
    setLastUpdated: (state, action: PayloadAction<Date>) => {
      state.lastUpdated = action.payload;
    },
    resetElection: () => initialState,
    clearElectionData: (state) => {
      state.results = [];
      state.selectedCandidateId = null;
    },
  },
});

export const {
  setCandidates,
  addCandidate,
  updateCandidate,
  removeCandidate,
  setResults,
  updateRegionResult,
  setSelectedCandidate,
  setLiveMode,
  setLastUpdated,
  resetElection,
  clearElectionData,
} = electionSlice.actions;

export default electionSlice.reducer;