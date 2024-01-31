import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import url from '../../apiDomain.json';

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

export const fetchItems = createAsyncThunk('items/fetchItems', async (
  { query, perPage, currentPage }, thunkAPI,
) => {
  const authToken = localStorage.getItem('authorization_token');
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${url.apiDomain}/api/v1/p/items`,
    params: {
      page: currentPage,
      per_page: perPage,
      query,
    },
    headers: {
      authorization: authToken,
    },
  };

  const response = await axios.request(config);
  if (response.status === 200) return response.data;

  return thunkAPI.rejectWithValue(response.data);
});

const publicItemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    resetItems: () => initialState,
    deleteItemById: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => ({
        ...state,
        loading: true,
        error: false,
        errorMessage: '',
      }))
      .addCase(fetchItems.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        items: action.payload.data || [],
        totalPages: action.payload.meta.total_pages || 0,
        currentPage: action.payload.meta.current_page || 0,
        perPage: action.payload.meta.per_page || 0,
        totalCount: action.payload.meta.total_count || 0,
      }))
      .addCase(fetchItems.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: true,
        errorMessage: action.error.message || 'An error occurred',
      }));
  },
});

export const { resetItems, deleteItemById } = publicItemsSlice.actions;

export default publicItemsSlice.reducer;
