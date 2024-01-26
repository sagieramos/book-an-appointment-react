import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLoading: false,
  reservations: [],
  error: null,
};

const API_URL = 'http://localhost:3000/api/v1';
export const addReservation = createAsyncThunk('reservations/addReservation', async (reservation) => {
  const response = await axios.post(`${API_URL}/reservations`, reservation);
    return response.data;
});


export const deleteReservation = createAsyncThunk('reservations/deleteReservation', async (reservationId) => {
    const response = await axios.delete(`${API_URL}/reservations/${reservationId}`);
        return response.data;
});

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addReservation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReservation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reservations.push(action.payload);
      })
      .addCase(addReservation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteReservation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReservation.fulfilled, (state, action) => {
        state.isLoading = false;
        const reservationId = action.payload;
        state.reservations = state.reservations.filter((reservation) => reservation.id !== reservationId);
      })
      .addCase(deleteReservation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

  },
});

export default reservationsSlice.reducer;