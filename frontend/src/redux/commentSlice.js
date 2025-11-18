// import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    comments: [],
    loading: false,
    error: false,
};

export const commentSlice = createSlice({
  name: 'comment',

  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {

        commentAdd:(state, action)=>{
            state.loading = false;
            state.comments.push(action.payload);
        },

        commentDelete:(state, action)=>{
            state.comments = state.comments.filter(comment => comment._id !== action.payload);
        },

        commentStart:(state)=>{
            state.loading = true;
        },

        commentFailure:(state)=>{
            state.loading = false;
            state.error = true;
        },

}
})

export const {commentAdd, commentDelete, commentStart, commentFailure} = commentSlice.actions;
export default commentSlice.reducer;






