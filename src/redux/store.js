import { configureStore } from '@reduxjs/toolkit';
import publicItemsReducer from './slices/publicItemsSlices';
import profileSlice from './slices/profileSlice';
import reservationSlice from './slices/reservationSlice';

const store = configureStore({
  reducer: {
    items: publicItemsReducer,
    profile: profileSlice,
    reservations: reservationSlice,
  },
});

export default store;
