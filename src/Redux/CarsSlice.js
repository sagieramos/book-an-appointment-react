import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const dns = '../domain.json'


console.log(dns)

export const fetchCars = createAsyncThunk('car/fetchCars', async () => {
  const response = await axios.get('/api/v1/p/items');
  return response.data.map((item) => ({
    id: item.id,
    name: item.name,
    img: item.img,
    description: item.description,
  }));
});

const headers = {
  'Content-Type': 'application/json', // Add any additional headers here
};

export const addCar = createAsyncThunk('car/addCar', async (newCarData) => {
  const formattedData = {
    car: newCarData,
  };

  try {
    const response = await axios.post('/api/v1/cars', formattedData, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data.error);
    throw error; // rethrow the error to be caught by the calling code
  }
});

export const deleteCar = createAsyncThunk('car/deleteCar', async (id, thunkAPI) => {
  try {
    const response = await axios.delete(`/api/v1/p/items/${id}`);
    thunkAPI.dispatch(fetchCars());
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to delete car...');
  }
});

const initialState = {
  isLoading: false,
  cars: [],
  error: null,
};
const carsSlice = createSlice({
  name: 'car',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCars.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCars.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cars = action.payload;
    });
    builder.addCase(fetchCars.rejected, (state, action) => {
      state.isLoading = false;
      state.cars = [];
      state.error = action.error.message;
    });
    // Reducers for adding a new car
    builder.addCase(addCar.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addCar.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cars.push(action.payload);
    });
    builder.addCase(addCar.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export default carsSlice.reducer;