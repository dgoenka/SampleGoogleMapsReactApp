import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import * as chrono from 'chrono-node';
import type {TransportOption} from '../types/types';
import cloneDeep from 'lodash.clonedeep';
const qs = require('qs');

// Slice
const slice = createSlice({
  name: 'transport',
  initialState: {
    transportOptions: [],
    currentlyShowingTransportOption: null,
  },
  reducers: {
    setTransportOptions: (state, action) => {
      state.transportOptions = action.payload;
      state.currentlyViewingTransportOption =
        (state.transportOptions ?? [])[0] ?? {};
    },
    updateTransportOption: (state, action) => {
      let option = action.payload;
      for (let i = 0; i < (state.transportOptions || []).length; i++) {
        if (option.devid === state.transportOptions[i].devid) {
          state.transportOptions[i] = option;
          break;
        }
      }
      if (
        state.currentlyViewingTransportOption &&
        state.currentlyViewingTransportOption.devid === option.devid
      ) {
        state.currentlyViewingTransportOption = option;
      }
    },
    setCurrentlyViewingTransportOption: (state, action) => {
      state.currentlyViewingTransportOption = action.payload;
    },
  },
});
export default slice.reducer;
// Actions
const {
  setTransportOptions,
  updateTransportOption,
  setCurrentlyViewingTransportOption,
} = slice.actions;

export const fetchTransportOptions = () => async dispatch => {
  try {
    let data = [
      {
        type: 'train',
        route_no: '165',
        devid: '9cbf248642fd8a63eef69611227ce1bb',
      },
      {
        type: 'bus',
        route_no: '120',
        devid: '87d25631aec6dc72916c395b0e4ba7cf',
      },
      {type: 'tram', route_no: '20', devid: 'dfe595c3ab905cf2e9fed5a24899114a'},
    ];

    dispatch(setTransportOptions(data));
    dispatch(pollTransportOption(data[0]));
  } catch (e) {
    return console.error(e.message);
  }
};

export const pollTransportOption =
  (option: TransportOption) => async dispatch => {
    let optionClone = cloneDeep(option);
    let devid = optionClone.devid;
    let config = {
      method: 'post',
      url: 'http://35.197.106.255:3000/api/v1.1/devstat/lastMultiple',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        devid,
      }),
    };
    let res = await axios(config);
    let data = res.data;
    optionClone.data = data;
    dispatch(updateTransportOption(optionClone));
  };

export const setCurrentlyViewingTransportOptionAction = option => dispatch => {
  dispatch(setCurrentlyViewingTransportOption(option));
  dispatch(pollTransportOption(option));
};
