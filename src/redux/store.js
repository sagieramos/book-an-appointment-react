import { configureStore } from '@reduxjs/toolkit';
import reservationsReducer from './reservationsSlice';
import publicItemsReducer from './slices/publicItemsSlices';

export const store = configureStore({
  reducer: {
    reservationStore: reservationsReducer,
    items: publicItemsReducer, 
  },
});