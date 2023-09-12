import {createSlice} from '@reduxjs/toolkit';

const constanSlice = createSlice({
  name: 'constan',
  initialState: {
    firebaseToken: '',
    refetch: false
  },
  reducers: {
    firebaseToken: (state, action) => {
      state.firebaseToken = action.payload;
    },
    refetch: (state, action) => {
      state.refetch = action.payload
    }
  },
});
export const {firebaseToken, refetch} = constanSlice.actions;

export default constanSlice.reducer;
