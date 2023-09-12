import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';
import constanReducer from './constanSlice';

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    constan: constanReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;