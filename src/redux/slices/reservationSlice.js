import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../apiDomain.json';

const initialState = {
  reservations: [],
  loading: false,
  error: false,
  errorMessage: '',
  totalPages: 0,
  currentPage: 0,
  perPage: 0,
  totalCount: 0,
};

export const fetchReservations = createAsyncThunk('reservations/fetchReservations', async ({
  query, username, perPage, page,
}, thunkAPI) => {
  const authToken = localStorage.getItem('authorization_token');
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${api.apiDomain}/api/v1/${username}/reservations`,
    params: {
      query,
      per_page: perPage,
      page,
    },
    headers: {
      Authorization: authToken,
    },

  };

  const response = await axios.request(config);
  if (response.status === 200) return response.data;

  return thunkAPI.rejectWithValue(response.data);
});

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    resetReservations: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, (state) => ({
        ...state,
        loading: true,
        error: false,
        errorMessage: '',
      }))
      .addCase(fetchReservations.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        reservations: action.payload.data || [],
        totalPages: action.payload.meta.total_pages || 0,
        currentPage: action.payload.meta.current_page || 0,
        perPage: action.payload.meta.per_page || 0,
        totalCount: action.payload.meta.total_count || 0,
      }))
      .addCase(fetchReservations.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: true,
        errorMessage: action.error.message || 'An error occurred',
      }));
  },
});

export const { resetReservations } = reservationSlice.actions;

export default reservationSlice.reducer;
