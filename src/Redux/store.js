import { configureStore } from '@reduxjs/toolkit';
import carsReducer from './CarsSlice';

export const store = configureStore({
  reducer: {
    car: carsReducer,
  },
});