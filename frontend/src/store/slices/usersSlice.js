import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api/apiService';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/auth/get-all-users');
      return response.users || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData, { rejectWithValue }) => {
    try {
      await apiService.post('/auth/add-user', userData);
      return true;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      await apiService.put(`/auth/update-user/${userId}`, userData);
      return true;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await apiService.delete(`/auth/delete-user/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete user');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
    addUserLoading: false,
    addUserError: null,
    addUserSuccess: false,
    updateUserLoading: false,
    updateUserError: null,
    updateUserSuccess: false,
    deleteUserLoading: false,
    deleteUserError: null,
    deleteUserSuccess: false,
  },
  reducers: {
    clearAddUserState: (state) => {
      state.addUserLoading = false;
      state.addUserError = null;
      state.addUserSuccess = false;
    },
    clearUpdateUserState: (state) => {
      state.updateUserLoading = false;
      state.updateUserError = null;
      state.updateUserSuccess = false;
    },
    clearDeleteUserState: (state) => {
      state.deleteUserLoading = false;
      state.deleteUserError = null;
      state.deleteUserSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addUser.pending, (state) => {
        state.addUserLoading = true;
        state.addUserError = null;
        state.addUserSuccess = false;
      })
      .addCase(addUser.fulfilled, (state) => {
        state.addUserLoading = false;
        state.addUserSuccess = true;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.addUserLoading = false;
        state.addUserError = action.payload;
        state.addUserSuccess = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateUserLoading = true;
        state.updateUserError = null;
        state.updateUserSuccess = false;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.updateUserLoading = false;
        state.updateUserSuccess = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserLoading = false;
        state.updateUserError = action.payload;
        state.updateUserSuccess = false;
      })
      .addCase(deleteUser.pending, (state) => {
        state.deleteUserLoading = true;
        state.deleteUserError = null;
        state.deleteUserSuccess = false;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.deleteUserLoading = false;
        state.deleteUserSuccess = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteUserLoading = false;
        state.deleteUserError = action.payload;
        state.deleteUserSuccess = false;
      });
  },
});

export const selectUsers = (state) => state.users.users;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;
export const selectAddUserLoading = (state) => state.users.addUserLoading;
export const selectAddUserError = (state) => state.users.addUserError;
export const selectAddUserSuccess = (state) => state.users.addUserSuccess;
export const selectUpdateUserLoading = (state) => state.users.updateUserLoading;
export const selectUpdateUserError = (state) => state.users.updateUserError;
export const selectUpdateUserSuccess = (state) => state.users.updateUserSuccess;
export const selectDeleteUserLoading = (state) => state.users.deleteUserLoading;
export const selectDeleteUserError = (state) => state.users.deleteUserError;
export const selectDeleteUserSuccess = (state) => state.users.deleteUserSuccess;
export const { clearAddUserState, clearUpdateUserState, clearDeleteUserState } = usersSlice.actions;

export default usersSlice.reducer; 