import { configureStore } from '@reduxjs/toolkit';
import publicItemsReducer from './slices/publicItemsSlices';


const store = configureStore({
  reducer: {
    items: publicItemsReducer,
  },
});

export default store;