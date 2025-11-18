import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userReducer from './userSlice'
import  videoReducer from './videoSlice';



const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const rootReducer = combineReducers({user:userReducer, video:videoReducer});

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({

  reducer: persistedReducer,
  
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
});

export const persistor = persistStore(store);

// Expose the store for debugging in the browser console (safe helper)
try {
  if (typeof window !== 'undefined') {
    window.__ECLIPX_STORE__ = store;
  }
} catch (err) {
  // ignore
}