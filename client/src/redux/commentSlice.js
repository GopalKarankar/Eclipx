// import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser:null,
    loading:false,
    error:false,
    isLoggedIn:false
};

export const commentSlice = createSlice({
  name: 'comment',

  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {

        commentAdd:(state, action)=>{
            state.loading = false;
            state.currentUser = action.payload;
            state.isLoggedIn = true;
        },

}
})

export const {login, loginStart, loginFailure, loginSuccess, logout, subscription} = commentSlice.actions;
export default commentSlice.reducer;






