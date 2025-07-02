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

export const addParticipant = createAsyncThunk(
  'participants/addParticipant',
  async (participantData, { rejectWithValue }) => {
    try {
      await apiService.post('/participants/create-participant', participantData);
      return true;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add participant');
    }
  }
);

export const updateParticipant = createAsyncThunk(
  'participants/updateParticipant',
  async ({ participantId, participantData }, { rejectWithValue }) => {
    try {
      await apiService.put(`/participants/update-participant/${participantId}`, participantData);
      return true;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update participant');
    }
  }
);

export const deleteParticipant = createAsyncThunk(
  'participants/deleteParticipant',
  async (participantId, { rejectWithValue }) => {
    try {
      await apiService.delete(`/participants/delete-participant/${participantId}`);
      return participantId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete participant');
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
    addParticipantLoading: false,
    addParticipantError: null,
    addParticipantSuccess: false,
    updateParticipantLoading: false,
    updateParticipantError: null,
    updateParticipantSuccess: false,
    deleteParticipantLoading: false,
    deleteParticipantError: null,
    deleteParticipantSuccess: false,
  },
  reducers: {
    clearAddParticipantState: (state) => {
      state.addParticipantLoading = false;
      state.addParticipantError = null;
      state.addParticipantSuccess = false;
    },
    clearUpdateParticipantState: (state) => {
      state.updateParticipantLoading = false;
      state.updateParticipantError = null;
      state.updateParticipantSuccess = false;
    },
    clearDeleteParticipantState: (state) => {
      state.deleteParticipantLoading = false;
      state.deleteParticipantError = null;
      state.deleteParticipantSuccess = false;
    },
  },
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
      })
      .addCase(addParticipant.pending, (state) => {
        state.addParticipantLoading = true;
        state.addParticipantError = null;
        state.addParticipantSuccess = false;
      })
      .addCase(addParticipant.fulfilled, (state) => {
        state.addParticipantLoading = false;
        state.addParticipantSuccess = true;
      })
      .addCase(addParticipant.rejected, (state, action) => {
        state.addParticipantLoading = false;
        state.addParticipantError = action.payload;
        state.addParticipantSuccess = false;
      })
      .addCase(updateParticipant.pending, (state) => {
        state.updateParticipantLoading = true;
        state.updateParticipantError = null;
        state.updateParticipantSuccess = false;
      })
      .addCase(updateParticipant.fulfilled, (state) => {
        state.updateParticipantLoading = false;
        state.updateParticipantSuccess = true;
      })
      .addCase(updateParticipant.rejected, (state, action) => {
        state.updateParticipantLoading = false;
        state.updateParticipantError = action.payload;
        state.updateParticipantSuccess = false;
      })
      .addCase(deleteParticipant.pending, (state) => {
        state.deleteParticipantLoading = true;
        state.deleteParticipantError = null;
        state.deleteParticipantSuccess = false;
      })
      .addCase(deleteParticipant.fulfilled, (state) => {
        state.deleteParticipantLoading = false;
        state.deleteParticipantSuccess = true;
      })
      .addCase(deleteParticipant.rejected, (state, action) => {
        state.deleteParticipantLoading = false;
        state.deleteParticipantError = action.payload;
        state.deleteParticipantSuccess = false;
      });
  },
});

export const selectParticipants = (state) => state.participants.participants;
export const selectParticipantsLoading = (state) => state.participants.loading;
export const selectParticipantsError = (state) => state.participants.error;
export const selectAddParticipantLoading = (state) => state.participants.addParticipantLoading;
export const selectAddParticipantError = (state) => state.participants.addParticipantError;
export const selectAddParticipantSuccess = (state) => state.participants.addParticipantSuccess;
export const selectUpdateParticipantLoading = (state) => state.participants.updateParticipantLoading;
export const selectUpdateParticipantError = (state) => state.participants.updateParticipantError;
export const selectUpdateParticipantSuccess = (state) => state.participants.updateParticipantSuccess;
export const selectDeleteParticipantLoading = (state) => state.participants.deleteParticipantLoading;
export const selectDeleteParticipantError = (state) => state.participants.deleteParticipantError;
export const selectDeleteParticipantSuccess = (state) => state.participants.deleteParticipantSuccess;
export const { clearAddParticipantState, clearUpdateParticipantState, clearDeleteParticipantState } = participantsSlice.actions;

export default participantsSlice.reducer; 