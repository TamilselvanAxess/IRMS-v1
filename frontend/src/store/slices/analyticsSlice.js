import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api/apiService';

// Async thunk to fetch analytics dashboard summary
export const fetchAnalyticsDashboard = createAsyncThunk(
  'analytics/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/analytics/dashboard-summary');
      // The backend returns { success, message, data }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch analytics dashboard');
    }
  }
);

// Async thunk to fetch course stats
export const fetchCourseStats = createAsyncThunk(
  'analytics/fetchCourseStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/analytics/courses');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch course stats');
    }
  }
);

// Async thunk to fetch weekly category trends
export const fetchWeeklyCategoryTrends = createAsyncThunk(
  'analytics/fetchWeeklyCategoryTrends',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/analytics/weekly');
      console.log('API response for weekly:', response);
      return response.weeklyData?.weeklyData || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch weekly category trends');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    dashboard: null,
    loading: false,
    error: null,
    courseStats: [],
    courseStatsLoading: false,
    courseStatsError: null,
    weeklyCategoryTrends: [],
    weeklyCategoryTrendsLoading: false,
    weeklyCategoryTrendsError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchAnalyticsDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Course stats
      .addCase(fetchCourseStats.pending, (state) => {
        state.courseStatsLoading = true;
        state.courseStatsError = null;
      })
      .addCase(fetchCourseStats.fulfilled, (state, action) => {
        state.courseStatsLoading = false;
        state.courseStats = action.payload;
      })
      .addCase(fetchCourseStats.rejected, (state, action) => {
        state.courseStatsLoading = false;
        state.courseStatsError = action.payload;
      })
      // Weekly category trends
      .addCase(fetchWeeklyCategoryTrends.pending, (state) => {
        state.weeklyCategoryTrendsLoading = true;
        state.weeklyCategoryTrendsError = null;
      })
      .addCase(fetchWeeklyCategoryTrends.fulfilled, (state, action) => {
        state.weeklyCategoryTrendsLoading = false;
        state.weeklyCategoryTrends = action.payload;
      })
      .addCase(fetchWeeklyCategoryTrends.rejected, (state, action) => {
        state.weeklyCategoryTrendsLoading = false;
        state.weeklyCategoryTrendsError = action.payload;
      });
  },
});

export default analyticsSlice.reducer; 