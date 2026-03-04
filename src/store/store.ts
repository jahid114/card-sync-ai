import { configureStore } from '@reduxjs/toolkit';
import { trytonApi } from './trytonApi';

export const store = configureStore({
  reducer: {
    [trytonApi.reducerPath]: trytonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(trytonApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
