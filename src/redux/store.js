import { configureStore } from '@reduxjs/toolkit';
import publicItemsReducer from './slices/publicItemsSlices';
import profileSlice from './slices/profileSlice';


export const store = configureStore({
  reducer: {
    items: publicItemsReducer,
    profile: profileSlice,
  },
});

export default store;