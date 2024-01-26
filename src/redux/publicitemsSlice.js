import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import url from '../../config.json';
const initialState = {
  items: [],
  loading: false,
  error: false,
  errorMessage: '',
  totalPages: 0,
  currentPage: 0,
  perPage: 0,
  totalCount: 0,
};
export const fetchItems = createAsyncThunk('items/fetchItems', async (query, _, thunkAPI) => {
  try {
    console.log(localStorage.getItem('authorization_token'));
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${url.apiDomain}/api/v1/p/items${query || ''}`,
      headers: {
        'authorization': localStorage.getItem('authorization_token') ? localStorage.getItem('authorization_token') : undefined,
      },
    };
    const response = await axios.request(config);
    return response.data; 
  } catch (error) {
    throw error;
  }
});
const publicitemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    resetItems: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.errorMessage = '';
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.totalPages = action.payload.meta.total_pages || 0;
        state.currentPage = action.payload.meta.current_page || 0;
        state.perPage = action.payload.meta.per_page || 0;
        state.totalCount = action.payload.meta.total_count || 0;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.error.message || 'An error occurred';
      });
  },
});
export const { resetItems } = publicitemsSlice.actions;
export default publicitemsSlice.reducer;