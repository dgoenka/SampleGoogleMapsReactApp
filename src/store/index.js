import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import transport from './transport';
const reducer = combineReducers({transport});
const store = configureStore({
  reducer,
});
export default store;
