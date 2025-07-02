import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api/apiService';

export const fetchParticipants = createAsyncThunk(
  'participants/fetchParticipants',
  async ({ search = '', status = 'all' } = {}, { rejectWithValue }) => {
    try {
      const params = [];
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (status !== 'all') params.push(`status=${encodeURIComponent(status)}`);
      const query = params.length ? `?${params.join('&')}` : '';
      const response = await apiService.get(`/participants/get-all-participants${query}`);
      return response.participants || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch participants');
    }
  }
);

const participantsSlice = createSlice({
  name: 'participants',
  initialState: {
    participants: [],
    loading: false,
    error: null,
    lastSearch: '',
    lastStatus: 'all',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchParticipants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParticipants.fulfilled, (state, action) => {
        state.loading = false;
        state.participants = action.payload;
      })
      .addCase(fetchParticipants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectParticipants = (state) => state.participants.participants;
export const selectParticipantsLoading = (state) => state.participants.loading;
export const selectParticipantsError = (state) => state.participants.error;

export default participantsSlice.reducer; 