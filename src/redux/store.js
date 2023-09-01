import { combineReducers,  createStore } from '@reduxjs/toolkit'
import { collpaseReducer } from './reducers/CollpaseReducer'
import { loadingReducer } from './reducers/LoadingReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web


const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['loadingReducer']
}
const reducer = combineReducers({
  collpaseReducer,
  loadingReducer
})
const persistedReducer = persistReducer(persistConfig, reducer)


const store = createStore(persistedReducer)
const persistor = persistStore(store)
export { store, persistor }
