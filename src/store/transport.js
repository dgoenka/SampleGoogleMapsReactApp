import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
// Slice
const slice = createSlice({
  name: 'transport',
  initialState: {
    transportOptions: [],
    currentlyShowingTransportOption: 0,
  },
  reducers: {
    setTransportOptions: (state, action) => {
      state.transportOptions = action;
    },
    updateTransportOption: (state, action) => {
      let option = action;
      for (let i = 0; i < (state.transportOptions || []).length; i++) {
        if (option.devid === state.transportOptions[i].devid) {
          state.transportOptions[i].devid = option;
          break;
        }
      }
    },
    setCurrentlyViewingTransportOption: (state, action) => {
      state.currentlyViewingTransportOption = action;
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
    console.log(
      'in transport, in fetchTransportOptions, data is: ' +
        JSON.stringify(data),
    );
    dispatch(setTransportOptions(data));
  } catch (e) {
    return console.error(e.message);
  }
};

export const pollTransportOption = option => async dispatch => {
  let devid = option.devid;
  let res = await axios.post(
    'http://35.197.106.255:3000/api/v1.1/devstat/lastMultiple',
    {devid},
  );
  option.data = res.data;
  dispatch(updateTransportOption(option));
};

export const setCurrentlyViewingTransportOptionAction = option => dispatch =>
  dispatch(setCurrentlyViewingTransportOption(option));
