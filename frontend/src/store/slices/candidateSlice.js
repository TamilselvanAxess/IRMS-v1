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

const candidateSlice = createSlice({
  name: 'candidates',
  initialState: {
    candidates: [],
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
      });
  },
});

export const selectCandidates = (state) => state.candidates.candidates;
export const selectCandidatesLoading = (state) => state.candidates.loading;
export const selectCandidatesError = (state) => state.candidates.error;

export default candidateSlice.reducer; 