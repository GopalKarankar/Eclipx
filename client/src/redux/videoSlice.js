// import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    videoList:null,
    currentVideo:null,
    loading:false,
    error:false,
};

export const videoSlice = createSlice({
  name: 'video',
  
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: initialState,
  reducers: {

        fetchStart:(state)=>{
            state.loading = true;
        },

        fetchSuccess:(state, action)=>{
            state.loading = false;
            state.currentVideo = action.payload;
        },

        fetchFailure:(state)=>{
            state.loading = false;
            state.error= true;
        },

        like: (state, action) =>{

                // if currentVideo does not contain that ID 
                if (!state.currentVideo.likes.includes(action.payload)) {

                    // then add it to "likes" array
                    state.currentVideo.likes.push(action.payload);

                    // then remove it from "dislikes" array
                    state.currentVideo.dislikes.splice( state.currentVideo.dislikes.findIndex((userId)=>userId === action.payload), 1 );

                }
        },

        dislike: (state, action) =>{

                // if currentVideo does not contain that ID 
                if (!state.currentVideo.dislikes.includes(action.payload)) {

                    // then add it to "dislikes" array
                    state.currentVideo.dislikes.push(action.payload);
                    
                    // then remove it from "likes" array
                    state.currentVideo.likes.splice(
                        state.currentVideo.likes.findIndex((userId)=>userId === action.payload), 1
                    );

                }
        },


}
})

export const { fetchStart, fetchFailure, fetchSuccess, like, dislike } = videoSlice.actions;
export default videoSlice.reducer;






