import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api/apiService';

// Async thunk to fetch all candidates
export const fetchCandidates = createAsyncThunk(
  'candidates/fetchCandidates',
  async (_, { rejectWithValue }) => {
    try {
      // Request a very high limit to get all candidates
      const response = await apiService.get('/candidates/get-all-candidates?page=1&limit=10000');
      // Backend returns { success, message, data: candidates[] }
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch candidates');
    }
  }
);

// Async thunk to fetch a single candidate by ID
export const fetchCandidateById = createAsyncThunk(
  'candidates/fetchCandidateById',
  async (candidateId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/candidates/get-candidate-by-id/${candidateId}`);
      // Backend returns { success, message, data: candidate }
      return response.data || null;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch candidate');
    }
  }
);

// Async thunk to update a candidate by ID
export const updateCandidateById = createAsyncThunk(
  'candidates/updateCandidateById',
  async ({ candidateId, candidateData }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`/candidates/update-candidate/${candidateId}`, candidateData);
      // Backend returns { success, message, data: candidate }
      return response.data || null;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update candidate');
    }
  }
);

const candidateSlice = createSlice({
  name: 'candidates',
  initialState: {
    candidates: [],
    selectedCandidate: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCandidateById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedCandidate = null;
      })
      .addCase(fetchCandidateById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCandidate = action.payload;
      })
      .addCase(fetchCandidateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedCandidate = null;
      })
      .addCase(updateCandidateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCandidateById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCandidate = action.payload;
      })
      .addCase(updateCandidateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectCandidates = (state) => state.candidates.candidates;
export const selectCandidatesLoading = (state) => state.candidates.loading;
export const selectCandidatesError = (state) => state.candidates.error;
export const selectSelectedCandidate = (state) => state.candidates.selectedCandidate;

export default candidateSlice.reducer; 