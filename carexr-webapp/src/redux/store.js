import { configureStore, createSlice } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from "@reduxjs/toolkit";
import thunk from 'redux-thunk';

import { setupListeners } from '@reduxjs/toolkit/query'

const persistConfig = {
    key: 'root',
    storage,
}

const rootReducers = combineReducers({
    user: userReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducers)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
});

setupListeners(store.dispatch)
export default store

